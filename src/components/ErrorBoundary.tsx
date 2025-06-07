// ===================================================================
// ERROR BOUNDARY - TRATAMENTO DE ERROS
// ===================================================================

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, FileText } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * Props do ErrorBoundary
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State do ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Componente ErrorBoundary para capturar erros React
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log do erro
    console.error('ErrorBoundary capturou um erro:', error);
    console.error('Stack trace:', errorInfo.componentStack);

    // Callback opcional para tratamento customizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Enviar erro para serviço de monitoramento (ex: Sentry)
    // this.logErrorToService(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;
    if (!error) return;

    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Criar email com relatório de erro
    const subject = encodeURIComponent('Relatório de Erro - Elaria RPG');
    const body = encodeURIComponent(
      `Ocorreu um erro na aplicação Elaria RPG:\n\n` +
      `Erro: ${error.message}\n\n` +
      `URL: ${window.location.href}\n\n` +
      `Timestamp: ${errorReport.timestamp}\n\n` +
      `Stack trace:\n${error.stack}\n\n` +
      `Component Stack:\n${errorInfo?.componentStack || 'N/A'}`
    );

    window.open(`mailto:suporte@elaria-rpg.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Renderizar fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderizar UI de erro padrão
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              {/* Ícone de erro */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>

              {/* Título */}
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Ops! Algo deu errado
              </h1>

              {/* Descrição */}
              <p className="text-gray-600 mb-6">
                Ocorreu um erro inesperado na aplicação. Você pode tentar novamente ou voltar à página inicial.
              </p>

              {/* Detalhes do erro (apenas em desenvolvimento) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Detalhes técnicos (apenas em desenvolvimento)
                  </summary>
                  <div className="bg-gray-100 rounded p-3 text-xs">
                    <div className="mb-2">
                      <strong>Erro:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Ações */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  fullWidth
                  variant="primary"
                >
                  Tentar Novamente
                </Button>

                <div className="flex gap-2">
                  <Button
                    onClick={this.handleGoHome}
                    leftIcon={<Home className="w-4 h-4" />}
                    variant="outline"
                    size="sm"
                    fullWidth
                  >
                    Ir para Início
                  </Button>

                  <Button
                    onClick={this.handleReportError}
                    leftIcon={<FileText className="w-4 h-4" />}
                    variant="ghost"
                    size="sm"
                    fullWidth
                  >
                    Reportar Erro
                  </Button>
                </div>
              </div>

              {/* Informações adicionais */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Se o problema persistir, entre em contato com o suporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para capturar erros em componentes funcionais
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Erro capturado:', error);
    if (errorInfo) {
      console.error('Info do erro:', errorInfo);
    }
    
    // Em produção, você poderia enviar para um serviço de monitoramento
    // reportErrorToService(error, errorInfo);
  };
}

/**
 * Componente de fallback simples para erros
 */
export const SimpleErrorFallback: React.FC<{ 
  error?: Error; 
  onRetry?: () => void;
}> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
    <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
    <h3 className="text-lg font-semibold text-red-800 mb-1">
      Erro ao carregar componente
    </h3>
    <p className="text-red-600 text-sm text-center mb-4">
      {error?.message || 'Ocorreu um erro inesperado'}
    </p>
    {onRetry && (
      <Button
        onClick={onRetry}
        variant="outline"
        size="sm"
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        Tentar Novamente
      </Button>
    )}
  </div>
);

/**
 * HOC para envolver componentes com ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
} 