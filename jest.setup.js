import '@testing-library/jest-dom/extend-expect'
import 'jest-axe/extend-expect'
import { back as nockBack } from 'nock'

nockBack.setMode('record')
global.setImmediate = jest.useRealTimers
