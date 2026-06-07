import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../../store/auth/authSlice';
import authService from '../../services/auth.service';
import { Input, Button } from '../../components/ui';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// Zod validation schema matching enterprise standard
const loginSchema = z.object({
  userId: z.string()
    .min(3, 'User ID must be at least 3 characters')
    .max(50, 'User ID is too long'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useAppSelector((state) => state.auth);

  useDocumentTitle('Login');

  // Redirection destination after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(loginStart());

    // Intercept demo credentials for local development
    if (data.userId === 'admin' && data.password === 'password') {
      const mockData = {
        token: 'mock-jwt-token-12345',
        user: {
          id: 'usr-1',
          name: 'Alex Wando',
          email: 'admin@preproute.com',
          role: 'admin' as const,
          createdAt: new Date().toISOString(),
        }
      };
      dispatch(loginSuccess(mockData));
      toast.success('Signed in successfully (Demo Mode)');
      navigate(from, { replace: true });
      return;
    }

    try {
      // Calling auth service
      const response = await authService.login({
        email: data.userId, // Mapping userId to email key for the API
        password: data.password,
      });

      if (response.success && response.data) {
        dispatch(loginSuccess(response.data));
        toast.success(`Welcome back, ${response.data.user.name}!`);
        navigate(from, { replace: true });
      } else {
        const errMsg = response.message || 'Invalid user ID or password';
        dispatch(loginFailure(errMsg));
        toast.error(errMsg);
      }
    } catch (err: unknown) {
      const errMsg = (err as { message?: string })?.message || 'Failed to authenticate. Please check your credentials.';
      dispatch(loginFailure(errMsg));
      // Toast notification is already handled globally in api.ts interceptor
    }
  };

  return (
    <div className="w-full">
      {/* Brand Logo */}
      <div className="mb-8 select-none">
        <img
          src="/logo.png"
          alt="PrepRoute Logo"
          className="h-16 w-auto object-contain"
          draggable={false}
        />
      </div>

      {/* Header Info */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-neutral-900 tracking-tight leading-none mb-2">
          Login
        </h1>
        <p className="text-[13px] font-medium text-neutral-500/90 leading-relaxed">
          Use your company provided Login credentials
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="User ID"
          placeholder="Enter User ID"
          error={errors.userId?.message}
          {...register('userId')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter Password"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Forgot Password Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            onClick={() => toast.success('Password reset link sent (simulated)')}
          >
            Forgot password?
          </button>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          className="w-full py-3 mt-2 text-sm font-semibold rounded-lg bg-[#4F83F1] hover:bg-[#3D72E1] active:scale-[0.98] text-white transition-all shadow-sm"
          isLoading={loading}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
