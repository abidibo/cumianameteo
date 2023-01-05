import { Box, Flex, Heading, Image, SimpleGrid } from '@chakra-ui/react'
import { useLastForecastQuery } from 'Forecast/Services/Api'
import { useTranslation } from 'react-i18next'

import Panel from '@Common/Components/Panel'
import BaseLayout from '@Common/Layouts/BaseLayout'
import { withLoader } from '@Common/Utils/HOF'
import dayjs from 'dayjs'
import { IoStarOutline } from 'react-icons/io5'

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
                <div className="forecast" dangerouslySetInnerHTML={{ __html: data.pattern }} />
              </Panel>
              <div>
                {data.day_forecasts.filter(f => dayjs(f.date).valueOf() >= dayjs().startOf('date').valueOf()).map(f => (
                  <Panel title={dayjs(f.date).format('D MMMM')} key={f.date}>
                    <Flex gap={2} alignItems='center' margin={'1rem 0'} justifyContent='flex-end'>
                      <IoStarOutline /> {t('forecast:ui.Reliability')}: {f.reliability}%
                    </Flex>
                    <div className="forecast-day" dangerouslySetInnerHTML={{ __html: f.text }} />

                    <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={4} margin='0 0 2rem'>
                      <Image src={`https://www.torinometeo.org${f.image12}`} />
                      <Image src={`https://www.torinometeo.org${f.image24}`} />
                    </SimpleGrid>

                    <Heading size='md'>{t('forecast:ui.Temperatures')}</Heading>
                    <div className="forecast-day" dangerouslySetInnerHTML={{ __html: f.temperatures }} />
                    <Heading size='md'>{t('forecast:ui.Winds')}</Heading>
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
