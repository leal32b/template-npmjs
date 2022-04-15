import templateNpmjs from '@/index'

describe('npmjsTemplate', () => {
  it('should have greeter as property', () => {
    expect(templateNpmjs.greeter).toBeTruthy()
  })
})
