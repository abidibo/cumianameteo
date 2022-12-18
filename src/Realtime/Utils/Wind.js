export const windDirection = (value) => {
    if (value < 11) {
      return 'N'
    } else if (value < 34) {
      return 'NNE'
    } else if (value < 56) {
      return 'NE'
    } else if (value < 79) {
        return 'ENE'
    } else if (value < 101) {
      return 'E'
    } else if (value < 124) {
      return 'ESE'
    } else if (value < 146) {
        return 'SE'
    } else if (value < 169) {
      return 'SSE'
    } else if (value < 191) {
      return 'S'
    } else if (value < 214) {
      return 'SSO'
    } else if (value < 236) {
      return 'SO'
    } else if (value < 259) {
      return 'OSO'
    } else if (value < 281) {
      return 'O'
    } else if (value < 304) {
      return 'ONO'
    } else if (value < 326) {
      return 'NO'
    } else if (value < 349) {
      return 'NNO'
    } else if (value < 360) {
      return 'N'
    } else {
      return ''
    }
}
