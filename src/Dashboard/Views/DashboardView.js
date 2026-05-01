import { Box, SimpleGrid, useMediaQuery } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { concat } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WiBarometer, WiHumidity, WiRain, WiThermometer } from 'react-icons/wi'
import { IoAnalyticsOutline } from 'react-icons/io5'

import { toast } from '@Common/Components/Toast'
import BaseLayout from '@Common/Layouts/BaseLayout'
import Timelapse from '@Dashboard/Components/Timelapse'
import GpsMap from '@Dashboard/Components/GpsMap'
import CurrentData, { HeroTemperature } from '@Realtime/Components/CurrentData'
import TodayChart from '@Realtime/Components/TodayChart'
import theme from '@Theme'
import config from '@Config'
import TodaySingleChart from '@Realtime/Components/TodaySingleChart'
import Panel from '@Common/Components/Panel'

const MotionBox = motion(Box)

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

const DashboardView = () => {
  const { t } = useTranslation()
  const [imagesUrls, setImagesUrls] = useState([])
  const [isBigScreen] = useMediaQuery(`(min-width: ${theme.breakpoints.md})`)

  useEffect(() => {
    const fetchImagesUrls = async () => {
      try {
        const res = await fetch(`https://cam.torinometeo.org/api/day.php?sid=${config.station.webcamId}`)
        const body = await res.json()
        setImagesUrls(body.images.SD.map(concat(config.station.webcamBaseUrl)))
      } catch (e) {
        toast({
          title: t(`dashboard:errors.FetchWebcamImagesUrlsError`),
          description: t(`dashboard:errors.FetchWebcamImagesUrlsErrorDescription`),
          status: 'error',
          duration: 10000,
          isClosable: true,
        })
      }
    }

    fetchImagesUrls()
  }, [])


  return (
    <BaseLayout>
      <MotionBox
        p={5}
        display="flex"
        flexDirection="column"
        gap={4}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Row 1: Hero temperature + Instruments */}
        <MotionBox variants={fadeUp}>
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4} alignItems="start">
            <HeroTemperature />
            <CurrentData />
          </SimpleGrid>
        </MotionBox>

        {/* Row 2: Timelapse + Globe */}
        <MotionBox variants={fadeUp}>
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4} alignItems="stretch">
            <Box display="flex" flexDirection="column">
              <Timelapse imagesUrls={imagesUrls} cover="https://cumiana.cam.torinometeo.org/24h/28/last.jpg?1924161112" />
            </Box>
            <Box display="flex" flexDirection="column">
              <GpsMap lat={44.999161} lng={7.364658} alt={490} />
            </Box>
          </SimpleGrid>
        </MotionBox>

        {/* Row 3: Combined overview chart (desktop only) */}
        {isBigScreen && (
          <MotionBox variants={fadeUp}>
            <Panel title={t('realtime:ui.TodayMeasures')} icon={<IoAnalyticsOutline />}>
              <TodayChart />
            </Panel>
          </MotionBox>
        )}

        {/* Row 4: Individual metric charts */}
        <MotionBox variants={fadeUp}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
            <Panel title={t('realtime:ui.Temperature')} icon={<WiThermometer size={20} />} variant="subtle">
              <TodaySingleChart keyName='temperature' label={t('realtime:ui.Temperature')} unit={'°C'} color={config.ui.chartColors[0]} />
            </Panel>
            <Panel title={t('realtime:ui.Pressure')} icon={<WiBarometer size={20} />} variant="subtle">
              <TodaySingleChart keyName='pressure' label={t('realtime:ui.Pressure')} unit={'hPa'} color={config.ui.chartColors[1]} />
            </Panel>
            <Panel title={t('realtime:ui.RelativeHumidity')} icon={<WiHumidity size={20} />} variant="subtle">
              <TodaySingleChart keyName='relative_humidity' label={t('realtime:ui.RelativeHumidity')} unit={'%'} color={config.ui.chartColors[2]} />
            </Panel>
            <Panel title={t('realtime:ui.Rain')} icon={<WiRain size={20} />} variant="subtle">
              <TodaySingleChart keyName='rain' label={t('realtime:ui.Rain')} unit={'mm'} color={config.ui.chartColors[3]} type='area' />
            </Panel>
          </SimpleGrid>
        </MotionBox>
      </MotionBox>
    </BaseLayout>
  )
}

export default DashboardView
