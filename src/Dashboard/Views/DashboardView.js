import { Box, SimpleGrid } from '@chakra-ui/react'
import { concat } from 'ramda'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from '@Common/Components/Toast'
import BaseLayout from '@Common/Layouts/BaseLayout'
import Timelapse from '@Dashboard/Components/Timelapse'

const DashboardView = () => {
  const { t } = useTranslation()
  const [imagesUrls, setImagesUrls] = useState([])

  useEffect(() => {
    const fetchImagesUrls = async () => {
      try {
        const res = await fetch('https://cam.torinometeo.org/api/day.php?sid=28')
        const body = await res.json()
        setImagesUrls(body.images.SD.map(concat('https://cumiana.cam.torinometeo.org/24h/28/')))
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
      <Box p={5} gap="1rem">
        <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={2}>
          <Box>
            <Timelapse imagesUrls={imagesUrls} cover="https://cumiana.cam.torinometeo.org/24h/28/last.jpg?1924161112" />
          </Box>
        </SimpleGrid>
      </Box>
    </BaseLayout>
  )
}

export default DashboardView
