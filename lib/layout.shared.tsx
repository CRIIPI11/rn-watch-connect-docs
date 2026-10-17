import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, libraryRepoUrl, libraryVersion } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          {appName}
          <span
            className="rounded-md border px-1.5 py-0.5 text-xs font-medium text-fd-muted-foreground"
            title={`Docs for ${appName} ${libraryVersion}`}
          >
            v{libraryVersion}
          </span>
        </>
      ),
    },
    githubUrl: libraryRepoUrl,
  };
}
