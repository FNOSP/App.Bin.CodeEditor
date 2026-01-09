import axios from 'axios'

import { HOST } from '@/utils/env'

export { axios }

export default axios.create({ baseURL: `${HOST}/api` })
