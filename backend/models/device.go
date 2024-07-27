package models

import "time"

type Device struct {
	ID     string    `json:"id"`
	Type   string    `json:"type"`
	Status string    `json:"status"`
	Uptime time.Time `json:"uptime"`
	Load   float64   `json:"load"`
}
