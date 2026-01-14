import { isDemoMode } from '../store/demo';

/**
 * Handles form submission in demo mode.
 * 
 * @param e The submit event
 * @param setLoading Optional callback to set loading state
 * @param setSuccess Optional callback to set success state
 * @param delay Simulation delay in ms (default 600)
 * @returns Promise<boolean> true if intercepted/handled, false if real submission should proceed
 */
export async function handleDemoFormSubmit(
  e: Event,
  setLoading?: (loading: boolean) => void,
  setSuccess?: (message: string) => void,
  delay: number = 600
): Promise<boolean> {
  // Check if demo mode is active
  if (!isDemoMode.get()) {
    return false;
  }

  e.preventDefault();

  // client-side validation should happen before calling this, 
  // or use form.checkValidity() here
  const form = e.target as HTMLFormElement;
  if (!form.checkValidity()) {
    form.reportValidity();
    return true; // Intercepted but invalid
  }

  // Simulate network request
  if (setLoading) setLoading(true);

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (setLoading) setLoading(false);
  
  if (setSuccess) {
    setSuccess('Success! (Demo Mode: No data was actually sent).');
  } else {
    alert('Success! (Demo Mode: No data was actually sent).');
  }

  form.reset();
  
  return true;
}
