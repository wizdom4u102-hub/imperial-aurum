export function calculateEarnings({
  startedAt,
  ratePerSecond,
}: {
  startedAt: string
  ratePerSecond: number
}) {
  const start =
    new Date(startedAt).getTime()

  const now =
    Date.now()

  const seconds =
    Math.floor(
      (now - start) / 1000
    )

  return (
    seconds *
    ratePerSecond
  )
}