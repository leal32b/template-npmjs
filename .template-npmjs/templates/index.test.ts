import PACKAGE_NAME from '@/index'

describe('npmjsTemplate', () => {
  it('should have greeter as property', () => {
    expect(PACKAGE_NAME.greeter).toBeTruthy()
  })
})
