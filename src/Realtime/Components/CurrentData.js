import { SimpleGrid, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text } from '@chakra-ui/react'
import { useCurrentDataQuery } from 'Realtime/Services/Api'
import { windDirection } from 'Realtime/Utils/Wind'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { GiDew } from 'react-icons/gi'
import { IoCalendarOutline } from 'react-icons/io5'
import { WiBarometer, WiHumidity, WiRain, WiThermometer, WiWindy } from 'react-icons/wi'

import { withLoader } from '@Common/Utils/HOF'

const CurrentData = () => {
  const { t } = useTranslation()
  const { data, isFetching } = useCurrentDataQuery()
  return withLoader(
    () => (
      <SimpleGrid columns={{ sm: 2, md: 3, lg: 7 }} spacing={2} margin="2rem 0">
        <Stat>
          <StatLabel display={'flex'} alignItems="center" gap={'.5rem'}>
            <IoCalendarOutline /> {t('realtime:ui.Datetime')}
          </StatLabel>
          <StatNumber>{dayjs(data.datetime).format('DD/MM/YY')}</StatNumber>
          <StatHelpText>{dayjs(data.datetime).format('HH:mm')}</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems="center" gap={'.5rem'}>
            <WiThermometer size={25} /> {t('realtime:ui.Temperature')}
          </StatLabel>
          <StatNumber>{data.temperature} °C</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            {data.temperature_min} °C
            <StatArrow type="increase" marginLeft={'.5rem'} />
            {data.temperature_max} °C
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems="center" gap={'.5rem'}>
            <WiBarometer size={25} /> {t('realtime:ui.Pressure')}
          </StatLabel>
          <StatNumber>{data.pressure} hPa</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            {data.pressure_min} hPa
            <StatArrow type="increase" marginLeft={'.5rem'} />
            {data.pressure_max} hPa
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems="center" gap={'.5rem'}>
            <WiHumidity size={25} /> {t('realtime:ui.RelativeHumidity')}
          </StatLabel>
          <StatNumber>{data.relative_humidity} %</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            {data.relative_humidity_min} %
            <StatArrow type="increase" marginLeft={'.5rem'} />
            {data.relative_humidity_max} %
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems="center" gap={'.5rem'}>
            <GiDew size={20} />
            {t('realtime:ui.Dewpoint')}
          </StatLabel>
          <StatNumber>{data.dewpoint} °C</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            {data.dewpoint_min} °C
            <StatArrow type="increase" marginLeft={'.5rem'} />
            {data.dewpoint_max} °C
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems="center" gap={'.5rem'}>
            <WiRain size={25} /> {t('realtime:ui.Rain')}
          </StatLabel>
          <StatNumber>
            {data.rain_rate} mm/h ({data.rain} mm)
          </StatNumber>
          <StatHelpText>
            <Text color="green.200" display={'inline'}>
              {t('ui.Month')}{' '}
            </Text>
            {data.rain_month} mm
            <Text color="red.400" display={'inline'}>
              {' '}
              {t('ui.Year')}{' '}
            </Text>
            {data.rain_year} mm
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display={'flex'} alignItems="center" gap={'.5rem'}>
            <WiWindy size={25} /> {t('realtime:ui.Wind')}
          </StatLabel>
          <StatNumber>
            {data.wind_strength} km/h {windDirection(data.wind_dir)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" marginLeft={'.5rem'} />
            {data.wind_strength_max} Km/h {windDirection(data.wind_dir_max)}
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    ),
    isFetching,
  )
}

export default CurrentData
