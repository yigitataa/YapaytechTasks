import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  window.matchMedia = () => ({ matches: false } as MediaQueryList)
})

describe('App', () => {
  it('Yatatodo başlığını ve API anahtarı akışını gösterir', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Yatatodo' })).toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Bir planlama oluştur' }))
    expect(screen.getByRole('dialog', { name: 'Gemini API anahtarı' })).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText('AIza...'), 'test-api-key')
    await userEvent.click(screen.getByRole('button', { name: 'Kaydet' }))
    expect(screen.getByRole('dialog', { name: 'Bugünü planla' })).toBeInTheDocument()
  })

  it('boş girişi reddeder', async () => {
    render(<App />)
    const now = new Date()
    const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
    expect(screen.getByLabelText('Tarih')).toHaveValue(localToday)
    await userEvent.click(screen.getByRole('button', { name: 'Ekle' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Lütfen bir görev yazın.')
  })

  it('görev ekler, tamamlar ve filtreler', async () => {
    render(<App />)
    await userEvent.type(screen.getByLabelText('Yeni görev'), 'Raporu tamamla')
    await userEvent.selectOptions(screen.getByLabelText('Öncelik'), 'medium')
    await userEvent.click(screen.getByRole('button', { name: 'Ekle' }))
    expect(screen.getByText('Raporu tamamla')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Raporu tamamla görevini tamamla' }))
    await userEvent.click(screen.getByRole('button', { name: /Açık/ }))
    expect(screen.getByText('Her şey tamam.')).toBeInTheDocument()
  })

  it('görevleri tarihe göre sıralar ve seçilen güne filtreler', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addTodo = async (title: string, date: string) => {
      await user.type(screen.getByLabelText('Yeni görev'), title)
      await user.selectOptions(screen.getByLabelText('Öncelik'), 'medium')
      fireEvent.change(screen.getByLabelText('Tarih'), { target: { value: date } })
      await user.click(screen.getByRole('button', { name: 'Ekle' }))
    }

    await addTodo('Geç görev', '2026-09-10')
    await addTodo('Erken görev', '2026-08-25')
    await user.selectOptions(screen.getByLabelText('Tarihe göre sırala'), 'dueDesc')

    const sortedItems = screen.getAllByRole('listitem')
    expect(within(sortedItems[0]).getByText('Geç görev')).toBeInTheDocument()
    expect(within(sortedItems[1]).getByText('Erken görev')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Tarihe göre filtrele'), { target: { value: '2026-08-25' } })
    expect(screen.getByText('Erken görev')).toBeInTheDocument()
    expect(screen.queryByText('Geç görev')).not.toBeInTheDocument()
  })
})
