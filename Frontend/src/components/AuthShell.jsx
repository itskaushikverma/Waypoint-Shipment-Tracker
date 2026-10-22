import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

export default function AuthShell({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLabel,
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Card className="bg-background/95 w-full max-w-md">
        <CardHeader className="space-y-4">
          <Logo withWordmark size={44} />
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="text-muted-foreground justify-center text-sm">
          {footerText}{' '}
          <Link
            to={footerLink}
            className="text-foreground ml-1 font-medium underline-offset-4 hover:underline"
          >
            {footerLabel}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
