package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/mux"
	"github.com/google/uuid"
	"github.com/rs/cors"
)

type Device struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Type   string  `json:"type"`
	Status string  `json:"status"`
}

var (
	devices = make(map[string]Device)
	mutex   = &sync.Mutex{}
)

const (
	StatusActive   = "Active"
	StatusInactive = "Inactive"
)

type ActiveClientsDataPoint struct {
	Timestamp time.Time `json:"timestamp"`
	Count     int       `json:"count"`
}

var (
	activeClientsData []ActiveClientsDataPoint
	activeClientsMutex sync.Mutex
)

func updateActiveClientsData() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		activeClientsMutex.Lock()
		count := 0
		for _, device := range devices {
			if device.Status == StatusActive {
				count++
			}
		}

		now := time.Now()
		
		// Always add a new data point, even if the count hasn't changed
		activeClientsData = append(activeClientsData, ActiveClientsDataPoint{
			Timestamp: now,
			Count:     count,
		})

		// Keep only the last hour of data
		oneHourAgo := now.Add(-1 * time.Hour)
		for len(activeClientsData) > 0 && activeClientsData[0].Timestamp.Before(oneHourAgo) {
			activeClientsData = activeClientsData[1:]
		}
		activeClientsMutex.Unlock()
	}
}

func getActiveClientsData(w http.ResponseWriter, r *http.Request) {
	activeClientsMutex.Lock()
	defer activeClientsMutex.Unlock()

	log.Printf("Sending active clients data: %+v", activeClientsData)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(activeClientsData)
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/api/devices", getDevices).Methods("GET")
	r.HandleFunc("/api/devices", addDevice).Methods("POST")
	r.HandleFunc("/api/devices/{id}", removeDevice).Methods("DELETE")
	r.HandleFunc("/api/devices/{id}/status", updateDeviceStatus).Methods("PATCH")
	r.HandleFunc("/api/active-clients", getActiveClientsData).Methods("GET")

	// Enable CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3001"}, // Allow your React app's origin
		AllowedMethods: []string{"GET", "POST", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	handler := c.Handler(r)

	log.Println("Server starting on port 8080...")
	go updateActiveClientsData()
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func getDevices(w http.ResponseWriter, r *http.Request) {
	mutex.Lock()
	defer mutex.Unlock()

	deviceList := make([]Device, 0, len(devices))
	for _, device := range devices {
		deviceList = append(deviceList, device)
	}

	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(deviceList)
	if err != nil {
		log.Printf("Error encoding devices: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	log.Printf("Returned %d devices", len(deviceList))
}

func addDevice(w http.ResponseWriter, r *http.Request) {
	var device Device
	err := json.NewDecoder(r.Body).Decode(&device)
	if err != nil {
		log.Printf("Error decoding device: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	device.ID = uuid.New().String()
	device.Status = StatusActive // Set status to Active by default

	// Validate the status
	if device.Status != StatusActive && device.Status != StatusInactive {
		http.Error(w, "Invalid status. Must be either Active or Inactive", http.StatusBadRequest)
		return
	}

	devices[device.ID] = device

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	err = json.NewEncoder(w).Encode(device)
	if err != nil {
		log.Printf("Error encoding new device: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	log.Printf("Added new device with ID: %s", device.ID)

	// Update active clients data immediately
	updateActiveClientsDataNow()
}

func removeDevice(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	mutex.Lock()
	defer mutex.Unlock()

	if _, exists := devices[id]; !exists {
		http.Error(w, "Device not found", http.StatusNotFound)
		return
	}

	delete(devices, id)
	w.WriteHeader(http.StatusNoContent)

	// Update active clients data immediately
	updateActiveClientsDataNow()
}

func updateDeviceStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var statusUpdate struct {
		Status string `json:"status"`
	}
	err := json.NewDecoder(r.Body).Decode(&statusUpdate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if statusUpdate.Status != StatusActive && statusUpdate.Status != StatusInactive {
		http.Error(w, "Invalid status. Must be either Active or Inactive", http.StatusBadRequest)
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	if device, exists := devices[id]; exists {
		device.Status = statusUpdate.Status
		devices[id] = device
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(device)

		// Update active clients data immediately
		updateActiveClientsDataNow()
	} else {
		http.Error(w, "Device not found", http.StatusNotFound)
	}
}

func updateActiveClientsDataNow() {
	activeClientsMutex.Lock()
	defer activeClientsMutex.Unlock()

	count := 0
	for _, device := range devices {
		if device.Status == StatusActive {
			count++
		}
	}

	now := time.Now()
	
	// Always add a new data point
	activeClientsData = append(activeClientsData, ActiveClientsDataPoint{
		Timestamp: now,
		Count:     count,
	})

	// Keep only the last hour of data
	oneHourAgo := now.Add(-1 * time.Hour)
	for len(activeClientsData) > 0 && activeClientsData[0].Timestamp.Before(oneHourAgo) {
		activeClientsData = activeClientsData[1:]
	}

	log.Printf("Updated active clients data: %+v", activeClientsData)
}