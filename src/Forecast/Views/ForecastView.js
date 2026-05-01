import { Box, Heading, Image, Link, SimpleGrid, Text, useColorMode } from '@chakra-ui/react'
import { useLastForecastQuery } from '@Foreacast/Services/Api'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { IoInformationCircleOutline, IoStarOutline } from 'react-icons/io5'

import Panel from '@Common/Components/Panel'
import BaseLayout from '@Common/Layouts/BaseLayout'
import { withLoader } from '@Common/Utils/HOF'
import ComponentsTheme from '@Theme/Components'

const InfoBanner = ({ icon, children, isDark }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={3}
    p={3}
    borderRadius="2px"
    bg={isDark ? 'rgba(16,185,129,0.06)' : 'rgba(5,150,105,0.06)'}
    border="1px solid"
    borderColor={isDark ? 'rgba(16,185,129,0.12)' : 'rgba(5,150,105,0.12)'}
    mb={4}
  >
    <Box color={isDark ? '#10B981' : '#059669'} flexShrink={0}>
      {icon}
    </Box>
    <Text
      fontFamily={ComponentsTheme.fonts.data}
      fontSize="xs"
      letterSpacing="wider"
      color={isDark ? 'gray.400' : 'gray.600'}
    >
      {children}
    </Text>
  </Box>
)

const ForecastView = () => {
  const { t } = useTranslation()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { data, isFetching } = useLastForecastQuery()

  return (
    <BaseLayout>
      <Box p={5} gap="1rem">
        {withLoader(
          () => (
            <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={4}>
              <Panel title={t('forecast:ui.Forecast')}>
                <InfoBanner icon={<IoInformationCircleOutline size={18} />} isDark={isDark}>
                  {t('forecast:ui.PoweredBy')}:
                  <Link
                    href="https://www.torinometeo.org"
                    rel="noreferrer"
                    target="_blank"
                    marginLeft=".5rem"
                    color={isDark ? '#10B981' : '#059669'}
                    fontWeight="600"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    TorinoMeteo
                  </Link>
                </InfoBanner>
                <div className="forecast" dangerouslySetInnerHTML={{ __html: data.pattern.replace('http:www', 'https://www') }} />
              </Panel>
              <div>
                {data.day_forecasts
                  .filter((f) => dayjs(f.date).valueOf() >= dayjs().startOf('date').valueOf())
                  .map((f) => (
                    <Panel title={dayjs(f.date).format('D MMMM')} key={f.date}>
                      <InfoBanner icon={<IoStarOutline size={16} />} isDark={isDark}>
                        {t('forecast:ui.Reliability')}: {f.reliability}%
                      </InfoBanner>
                      <div className="forecast-day" dangerouslySetInnerHTML={{ __html: f.text }} />

                      <SimpleGrid columns={{ sm: 1, md: 1, lg: 2 }} spacing={4} margin="0 0 2rem">
                        <Image src={`https://www.torinometeo.org${f.image12}`} borderRadius="2px" />
                        <Image src={`https://www.torinometeo.org${f.image24}`} borderRadius="2px" />
                      </SimpleGrid>

                      <Heading
                        size="md"
                        fontFamily={ComponentsTheme.fonts.heading}
                        textTransform="uppercase"
                        letterSpacing="wider"
                        color={isDark ? '#10B981' : '#059669'}
                        fontSize="sm"
                        mb={2}
                        mt={4}
                      >
                        {t('forecast:ui.Temperatures')}
                      </Heading>
                      <div className="forecast-day" dangerouslySetInnerHTML={{ __html: f.temperatures }} />
                      <Heading
                        size="md"
                        fontFamily={ComponentsTheme.fonts.heading}
                        textTransform="uppercase"
                        letterSpacing="wider"
                        color={isDark ? '#10B981' : '#059669'}
                        fontSize="sm"
                        mb={2}
                        mt={4}
                      >
                        {t('forecast:ui.Winds')}
                      </Heading>
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
