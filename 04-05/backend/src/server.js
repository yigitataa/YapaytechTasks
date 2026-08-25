import app from './app.js'

const DEFAULT_PORT = 3000
const configuredPort = Number(process.env.PORT ?? DEFAULT_PORT)
const portIsValid =
  Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort <= 65535

if (!portIsValid) {
  console.error('PORT değeri 1 ile 65535 arasında bir tam sayı olmalıdır.')
  process.exit(1)
}

const server = app.listen(configuredPort, () => {
  console.log(`Backend http://localhost:${configuredPort} adresinde çalışıyor.`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${configuredPort} kullanımda. Çalışan süreci durdurun veya PORT değerini değiştirin.`,
    )
  } else {
    console.error('Backend başlatılamadı:', error)
  }

  process.exit(1)
})

