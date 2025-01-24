import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  Image,
  Box,
  ModalFooter,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import { Book } from '../types/book';
import { BookCamera } from './BookCamera';

interface AddBookFormProps {
  onAddBook: (book: Book) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  title: string;
  author: string;
  category: string;
  coverImage: string | null;
  showCamera: boolean;
}

// 事前定義されたカテゴリー
const predefinedCategories = [
  'ビジネス',
  '技術書',
  '小説',
  '自己啓発',
  '歴史',
  '科学',
  'その他'
];

const initialState: FormState = {
  title: '',
  author: '',
  category: '',
  coverImage: null,
  showCamera: true, // デフォルトでカメラを表示
};

export default function AddBookForm({ onAddBook, isOpen, onClose }: AddBookFormProps) {
  const [state, setState] = useState<FormState>(initialState);

  // モーダルが開いたときにカメラを表示
  useEffect(() => {
    if (isOpen) {
      setState(prev => ({ ...prev, showCamera: true }));
    }
  }, [isOpen]);

  const handleClose = () => {
    setState(initialState);
    onClose();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!state.title || !state.author) return;

    const book: Book = {
      id: uuidv4(),
      title: state.title,
      author: state.author,
      status: '未読',
      category: state.category,
      coverImage: state.coverImage || undefined,
      lastReadDate: new Date().toISOString(),
    };

    onAddBook(book);
    setState(initialState);
  };

  const handleBookInfoDetected = (
    detectedTitle: string, 
    detectedAuthor: string, 
    detectedCategory: string,
    imageSrc?: string
  ) => {
    setState({
      ...state,
      title: detectedTitle,
      author: detectedAuthor,
      category: detectedCategory,
      coverImage: imageSrc || null,
      showCamera: false,
    });
  };

  const handleSwitchToManual = () => {
    setState({
      ...state,
      showCamera: false
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>本を追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {state.showCamera ? (
            <BookCamera 
              onBookInfoDetected={handleBookInfoDetected}
              onSwitchToManual={handleSwitchToManual}
            />
          ) : (
            <form id="add-book-form" onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {state.coverImage && (
                  <Box width="200px" height="300px">
                    <Image
                      src={state.coverImage}
                      alt="Book cover"
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      borderRadius="md"
                    />
                  </Box>
                )}

                <FormControl isRequired>
                  <FormLabel>タイトル</FormLabel>
                  <Input
                    value={state.title}
                    onChange={(e) => setState({
                      ...state,
                      title: e.target.value
                    })}
                    placeholder="本のタイトルを入力"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>著者</FormLabel>
                  <Input
                    value={state.author}
                    onChange={(e) => setState({
                      ...state,
                      author: e.target.value
                    })}
                    placeholder="著者名を入力"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>カテゴリー</FormLabel>
                  <Select
                    value={state.category}
                    onChange={(e) => setState({
                      ...state,
                      category: e.target.value
                    })}
                    placeholder="カテゴリーを選択"
                  >
                    {predefinedCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  leftIcon={<EditIcon />}
                  onClick={() => setState({
                    ...state,
                    showCamera: true
                  })}
                  colorScheme="teal"
                  variant="outline"
                  width="100%"
                >
                  写真を撮り直す
                </Button>
              </VStack>
            </form>
          )}
        </ModalBody>
        {!state.showCamera && (
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              キャンセル
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleSubmit()}
              isDisabled={!state.title || !state.author}
            >
              追加
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}