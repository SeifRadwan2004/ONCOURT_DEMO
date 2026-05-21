interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-lg">{description}</p>
        )}
        <div className="mt-8 inline-block px-6 py-3 bg-secondary rounded-lg">
          <p className="text-sm text-secondary-foreground">
            Coming soon. Prompt the user to continue with more details to fill in this page.
          </p>
        </div>
      </div>
    </div>
  );
}
