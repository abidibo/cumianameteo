import { SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { useCurrentDataQuery } from 'Realtime/Services/Api'
import { windDirection } from 'Realtime/Utils/Wind'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { withLoader } from '@Common/Utils/HOF'
import { IoCalendarOutline } from 'react-icons/io5'
import { WiBarometer, WiHumidity, WiRain, WiThermometer, WiWindy } from 'react-icons/wi'
import { GiDew } from 'react-icons/gi'

const CurrentData = () => {
  const { t } = useTranslation()
  const { data, isFetching } = useCurrentDataQuery()
  return withLoader(
    () => (
      <SimpleGrid columns={{ sm: 2, md: 3, lg: 7 }} spacing={2} margin="2rem 0">
        <Stat>
          <StatLabel display={'flex'} alignItems='center' gap={'.5rem'}><IoCalendarOutline /> {t('realtime:ui.Datetime')}</StatLabel>
          <StatNumber>{dayjs(data.dateime).format('DD/MM/YY HH:mm')}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems='center' gap={'.5rem'}><WiThermometer size={25} /> {t('realtime:ui.Temperature')}</StatLabel>
          <StatNumber>{data.temperature} °C</StatNumber>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems='center' gap={'.5rem'}><WiBarometer size={25} /> {t('realtime:ui.Pressure')}</StatLabel>
          <StatNumber>{data.pressure} hPa</StatNumber>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems='center' gap={'.5rem'}><WiHumidity size={25} /> {t('realtime:ui.RelativeHumidity')}</StatLabel>
          <StatNumber>{data.relative_humidity} %</StatNumber>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems='center' gap={'.5rem'}><GiDew size={20} />{t('realtime:ui.Dewpoint')}</StatLabel>
          <StatNumber>{data.dewpoint} °C</StatNumber>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems='center' gap={'.5rem'}><WiRain size={25} /> {t('realtime:ui.Rain')}</StatLabel>
          <StatNumber>
            {data.rain_rate} mm/h ({data.rain} mm)
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems='center' gap={'.5rem'}><WiWindy size={25} /> {t('realtime:ui.Wind')}</StatLabel>
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
