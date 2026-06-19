import { useIntlayer } from 'react-intlayer'

export const HomePage = () => {
  const t = useIntlayer('home')

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">{t.recommendedForYou}</h1>
        {/* <Button variant="outline" size="sm" disabled>
          <RefreshCwIcon />
          {t.refresh}
        </Button> */}
      </header>

      {/* {recommendations.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recommendations.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      )} */}
    </div>
  )
}
