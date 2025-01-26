import { Component, ErrorInfo, ReactNode } from 'react'
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box p={8}>
          <VStack spacing={4}>
            <Heading>エラーが発生しました</Heading>
            <Text>{this.state.error?.message}</Text>
            <Button onClick={() => window.location.reload()}>
              ページを再読み込み
            </Button>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary