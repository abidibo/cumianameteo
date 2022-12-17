import { Box, SimpleGrid } from '@chakra-ui/react'
import BaseLayout from '@Common/Layouts/BaseLayout'
import Timelapse from '@Dashboard/Components/Timelapse'

const DashboardView = () => {
  return (
    <BaseLayout>
      <Box p={5} gap="1rem">
        <SimpleGrid columns={2} spacing={2}>
          <Box>
            <Timelapse cover='https://cumiana.cam.torinometeo.org/24h/28/last.jpg?1924161112'/>
          </Box>
        </SimpleGrid>
      </Box>
    </BaseLayout>
  )
}

export default DashboardView
