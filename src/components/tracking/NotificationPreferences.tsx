'use client'

import { useState } from 'react'

type NotificationChannel = {
  id: string
  type: 'email' | 'sms' | 'push' | 'whatsapp'
  value: string
  enabled: boolean
}

type NotificationEvent = {
  id: string
  name: string
  description: string
  enabled: boolean
}

export default function NotificationPreferences() {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    { id: '1', type: 'email', value: '', enabled: true },
    { id: '2', type: 'sms', value: '', enabled: false },
    { id: '3', type: 'push', value: '', enabled: false },
    { id: '4', type: 'whatsapp', value: '', enabled: false }
  ])

  const [events, setEvents] = useState<NotificationEvent[]>([
    {
      id: '1',
      name: 'Statusänderung',
      description: 'Benachrichtigung bei jeder Statusänderung',
      enabled: true
    },
    {
      id: '2',
      name: 'Qualitätsprüfung',
      description: 'Benachrichtigung nach Abschluss der Qualitätsprüfung',
      enabled: true
    },
    {
      id: '3',
      name: 'Versand',
      description: 'Benachrichtigung bei Versand der Ware',
      enabled: true
    },
    {
      id: '4',
      name: 'Zustellung',
      description: 'Benachrichtigung bei Zustellung der Ware',
      enabled: true
    },
    {
      id: '5',
      name: 'Verzögerungen',
      description: 'Benachrichtigung bei Verzögerungen',
      enabled: true
    }
  ])

  const handleChannelToggle = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ))
  }

  const handleEventToggle = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, enabled: !event.enabled }
        : event
    ))
  }

  const handleChannelValueChange = (channelId: string, value: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId
        ? { ...channel, value }
        : channel
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Benachrichtigungseinstellungen</h2>

      {/* Benachrichtigungskanäle */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Benachrichtigungskanäle</h3>
        <div className="space-y-4">
          {channels.map(channel => (
            <div key={channel.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={channel.enabled}
                  onChange={() => handleChannelToggle(channel.id)}
                  className="rounded border-gray-300 text-indigo-600"
                />
                <label className="text-sm font-medium text-gray-700">
                  {channel.type === 'email' && 'E-Mail'}
                  {channel.type === 'sms' && 'SMS'}
                  {channel.type === 'push' && 'Push-Benachrichtigung'}
                  {channel.type === 'whatsapp' && 'WhatsApp'}
                </label>
              </div>
              <input
                type={channel.type === 'email' ? 'email' : 'tel'}
                value={channel.value}
                onChange={(e) => handleChannelValueChange(channel.id, e.target.value)}
                placeholder={`${channel.type === 'email' ? 'E-Mail' : 'Nummer'} eingeben`}
                className="rounded-md border-gray-300 w-64"
                disabled={!channel.enabled}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Benachrichtigungsereignisse */}
      <div>
        <h3 className="text-lg font-medium mb-4">Benachrichtigungsereignisse</h3>
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={event.enabled}
                onChange={() => handleEventToggle(event.id)}
                className="mt-1 rounded border-gray-300 text-indigo-600"
              />
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {event.name}
                </label>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speichern-Button */}
      <div className="mt-8">
        <button
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md 
                   hover:bg-indigo-700"
        >
          Einstellungen speichern
        </button>
      </div>
    </div>
  )
} 