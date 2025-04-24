import React from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import LanguageSelector from './LanguageSelector';

const TranslationPanel = ({
  title,
  language,
  onLanguageChange,
  languages,
  text,
  isLoading,
  placeholder,
  actionButton,
  secondaryButton,
  children,
  darkMode,
}) => {
  return (
    <Card animate className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <LanguageSelector
          selectedLanguage={language}
          onLanguageChange={onLanguageChange}
          languages={languages}
          className="w-40"
        />
      </CardHeader>
      
      <CardContent className="flex-grow">
        {children}
      </CardContent>
      
      {(actionButton || secondaryButton) && (
        <CardFooter className="flex justify-between">
          {actionButton && (
            <Button
              variant={actionButton.variant || 'primary'}
              onClick={actionButton.onClick}
              disabled={actionButton.disabled || isLoading}
              isLoading={isLoading}
              leftIcon={actionButton.icon}
              className={actionButton.className}
              fullWidth={!secondaryButton}
            >
              {actionButton.label}
            </Button>
          )}
          
          {secondaryButton && (
            <Button
              variant={secondaryButton.variant || 'secondary'}
              onClick={secondaryButton.onClick}
              disabled={secondaryButton.disabled || isLoading}
              leftIcon={secondaryButton.icon}
              className={secondaryButton.className}
            >
              {secondaryButton.label}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default TranslationPanel;
