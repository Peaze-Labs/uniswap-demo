import { injectedConnection } from 'connection'
import { usePeazeReact } from 'state/peaze/hooks'
import { mocked } from 'test-utils/mocked'
import { render } from 'test-utils/render'

import StatusIcon from './StatusIcon'

const ACCOUNT = '0x0'

jest.mock('../../hooks/useSocksBalance', () => ({
  useHasSocks: () => true,
}))

describe('StatusIcon', () => {
  describe('with no account', () => {
    it('renders children in correct order', () => {
      const component = render(<StatusIcon account={ACCOUNT} connection={injectedConnection} />)
      expect(component.getByTestId('StatusIconRoot')).toMatchSnapshot()
    })

    it('renders without mini icons', () => {
      const component = render(<StatusIcon account={ACCOUNT} connection={injectedConnection} showMiniIcons={false} />)
      expect(component.getByTestId('StatusIconRoot').children.length).toEqual(0)
    })
  })

  describe('with account', () => {
    beforeEach(() => {
      mocked(usePeazeReact).mockReturnValue({
        account: '0x52270d8234b864dcAC9947f510CE9275A8a116Db',
        isActive: true,
      } as ReturnType<typeof usePeazeReact>)
    })

    it('renders children in correct order', () => {
      const component = render(<StatusIcon account={ACCOUNT} connection={injectedConnection} />)
      expect(component.getByTestId('StatusIconRoot')).toMatchSnapshot()
    })

    it('renders without mini icons', () => {
      const component = render(<StatusIcon account={ACCOUNT} connection={injectedConnection} showMiniIcons={false} />)
      expect(component.getByTestId('StatusIconRoot').children.length).toEqual(0)
    })
  })
})
