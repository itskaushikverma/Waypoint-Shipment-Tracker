import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import PasswordField from '../components/PasswordField';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from 'react-toast-kit-js';
import { useLoginMutation } from '../redux/api';
import { setAuthenticated } from '../redux/authSlice';
import z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }) => {
    try {
      const resp = await login({ email, password }).unwrap();
      dispatch(
        setAuthenticated({ isAuthenticated: resp.data.isAuthenticated, token: resp.data.token }),
      );
      navigate('/', { replace: true });
    } catch (err) {
      error(err?.data?.message);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your account to track shipments."
      footerText="Need an account?"
      footerLink="/signup"
      footerLabel="Create one"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            placeholder="you@company.com"
            {...register('email')}
          />
          {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordField
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            {...register('password')}
            disabled={isLoading}
          />
          {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  );
}
