import { forwardRef, useState } from 'react';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { Input } from './ui/input';

const PasswordField = forwardRef(function PasswordField({ id, ...props }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input id={id} ref={ref} type={visible ? 'text' : 'password'} className="pr-10" {...props} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <RiEyeOffLine className="h-4 w-4" /> : <RiEyeLine className="h-4 w-4" />}
      </button>
    </div>
  );
});

export default PasswordField;
