import { Alert, AlertIcon, Box, Heading, Image, Link, SimpleGrid } from '@chakra-ui/react'
import { useLastForecastQuery } from 'Forecast/Services/Api'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { IoStarOutline } from 'react-icons/io5'

import Panel from '@Common/Components/Panel'
import BaseLayout from '@Common/Layouts/BaseLayout'
import { withLoader } from '@Common/Utils/HOF'

const ForecastView = () => {
  const { t } = useTranslation()
  const { data, isFetching } = useLastForecastQuery()
  return (
    <BaseLayout>
      <Box p={5} gap="1rem">
        {withLoader(
          () => (
            <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={4}>
              <Panel title={t('forecast:ui.Forecast')}>
                <Alert status="info">
                  <AlertIcon />
                  {t('forecast:ui.PoweredBy')}:
                  <Link href="https://www.torinometeo.org" rel="noreferrer" target="_blank" marginLeft={'.5rem'}>
                    TorinoMeteo
                  </Link>
                </Alert>
                <div className="forecast" dangerouslySetInnerHTML={{ __html: data.pattern.replace('http:www', 'https://www') }} />
              </Panel>
              <div>
                {data.day_forecasts
                  .filter((f) => dayjs(f.date).valueOf() >= dayjs().startOf('date').valueOf())
                  .map((f) => (
                    <Panel title={dayjs(f.date).format('D MMMM')} key={f.date}>
                      <Alert status="info" alignItems={'center'} justifyContent='flex-end' gap={2}>
                        <IoStarOutline /> {t('forecast:ui.Reliability')}: {f.reliability}%
                      </Alert>
                      <div className="forecast-day" dangerouslySetInnerHTML={{ __html: f.text }} />

                      <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={4} margin="0 0 2rem">
                        <Image src={`https://www.torinometeo.org${f.image12}`} />
                        <Image src={`https://www.torinometeo.org${f.image24}`} />
                      </SimpleGrid>

                      <Heading size="md">{t('forecast:ui.Temperatures')}</Heading>
                      <div className="forecast-day" dangerouslySetInnerHTML={{ __html: f.temperatures }} />
                      <Heading size="md">{t('forecast:ui.Winds')}</Heading>
                      <div className="forecast-day" dangerouslySetInnerHTML={{ __html: f.winds }} />
                    </Panel>
                  ))}
              </div>
            </SimpleGrid>
          ),
          isFetching,
        )}
      </Box>
    </BaseLayout>
  )
}

export default ForecastView
