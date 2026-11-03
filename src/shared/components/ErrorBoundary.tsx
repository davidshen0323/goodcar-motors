import type { PropsWithChildren } from 'react';
import { Component } from 'react';
export default class ErrorBoundary extends Component<
  PropsWithChildren,
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <main className="app-error">
          <h1>頁面暫時無法開啟 / Unable to open this page</h1>
          <p>請重新整理後再試一次。 / Please refresh and try again.</p>
          <button onClick={() => window.location.reload()}>
            重新整理 / Refresh
          </button>
        </main>
      );
    return this.props.children;
  }
}
