import greeter from '@/components/greeter'

describe('Greeter', () => {
  it('should return greeting message correctly', () => {
    const name = 'John Doe'
    const result = greeter(name)

    expect(result).toBe('Hello John Doe!')
  })
})
