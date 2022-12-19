import { SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { useCurrentDataQuery } from 'Realtime/Services/Api'
import { windDirection } from 'Realtime/Utils/Wind'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'

const CurrentData = () => {
  const { t } = useTranslation()
  const { data, isFetching } = useCurrentDataQuery()
  console.log('DATA', data) // eslint-disable-line
  return withLoader(
    () => (
      <SimpleGrid columns={{ sm: 2, md: 3, lg: 7 }} spacing={2} margin="2rem 0">
        <Stat>
          <StatLabel>{t('realtime:ui.Datetime')}</StatLabel>
          <StatNumber>{dayjs(data.dateime).format('DD/MM/YY HH:mm')}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>{t('realtime:ui.Temperature')}</StatLabel>
          <StatNumber>{data.temperature} °C</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>{t('realtime:ui.Pressure')}</StatLabel>
          <StatNumber>{data.pressure} hPa</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>{t('realtime:ui.RelativeHumidity')}</StatLabel>
          <StatNumber>{data.relative_humidity} %</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>{t('realtime:ui.Dewpoint')}</StatLabel>
          <StatNumber>{data.dewpoint} °C</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>{t('realtime:ui.Rain')}</StatLabel>
          <StatNumber>
            {data.rain_rate} mm/h ({data.rain} mm)
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>{t('realtime:ui.Wind')}</StatLabel>
          <StatNumber>
            {data.wind_strength} km/s {windDirection(data.wind_dir)}
          </StatNumber>
        </Stat>
      </SimpleGrid>
    ),
    isFetching,
  )
}

export default CurrentData
