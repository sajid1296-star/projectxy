'use client'

import { useState, useEffect } from 'react'

type StatusStep = {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
  timestamp?: Date
  details?: {
    location?: string
    handler?: string
    notes?: string[]
  }
}

export default function StatusDisplay() {
  const [steps, setSteps] = useState<StatusStep[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Auftragsstatus</h2>

      {/* Fortschrittsbalken */}
      <div className="relative mb-8">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap 
                     text-white justify-center bg-indigo-600"
          ></div>
        </div>
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center
                          ${
                            index < currentStep
                              ? 'bg-indigo-600 text-white'
                              : index === currentStep
                              ? 'border-2 border-indigo-600 text-indigo-600'
                              : 'border-2 border-gray-400 text-gray-400'
                          }`}
              >
                {index + 1}
              </div>
              <div className="text-sm mt-2">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detaillierte Statusanzeige */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`border rounded-lg p-4 ${
              step.status === 'current'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              {step.timestamp && (
                <div className="text-sm text-gray-500">
                  {step.timestamp.toLocaleString()}
                </div>
              )}
            </div>

            {step.details && (
              <div className="mt-4 space-y-2">
                {step.details.location && (
                  <p className="text-sm">
                    <span className="font-medium">Standort:</span>{' '}
                    {step.details.location}
                  </p>
                )}
                {step.details.handler && (
                  <p className="text-sm">
                    <span className="font-medium">Bearbeiter:</span>{' '}
                    {step.details.handler}
                  </p>
                )}
                {step.details.notes && step.details.notes.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Anmerkungen:</span>
                    <ul className="list-disc list-inside mt-1">
                      {step.details.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 