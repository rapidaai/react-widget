import { cn } from '@/styles/media';

describe('cn (class name merger)', () => {
  it('returns a single class unchanged', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('merges multiple classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('removes falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar');
  });

  it('handles conditional class objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    // twMerge keeps the last of conflicting utilities
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('returns empty string when no classes are provided', () => {
    expect(cn()).toBe('');
  });

  it('handles array of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });
});
