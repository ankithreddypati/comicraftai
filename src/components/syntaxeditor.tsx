import { useEffect } from "react";
import {
  Box,
  Button,
  FormField,
  MultilineInput,
} from "@canva/app-ui-kit";
import { useAppContext } from "src/context";
import { AppMessages as Messages } from "src/app.messages";

// Adjust these constants as needed
const MAX_SYNTAX_LENGTH = 1000;
const MIN_SYNTAX_ROWS = 10;

export const SyntaxEditor = () => {
  const { 
    mermaidSyntax, 
    setMermaidSyntax, 
    mermaidSyntaxError,
    selectedImage,
    isLoadingDiagram
  } = useAppContext();

  useEffect(() => {
    if (selectedImage && selectedImage.mermaidSyntax) {
      setMermaidSyntax(selectedImage.mermaidSyntax);
    }
  }, [selectedImage, setMermaidSyntax]);

  const onSyntaxChange = (value: string) => {
    setMermaidSyntax(value);
  };

  const onUpdateDiagram = () => {
    // Implement the logic to update the diagram based on the edited syntax
    // This might involve calling an API or updating the app state
    console.log("Updating diagram with new syntax:", mermaidSyntax);
  };

  const UpdateButton = () => (
    <Button 
      variant="primary" 
      onClick={onUpdateDiagram}
      disabled={isLoadingDiagram}
    >
      {isLoadingDiagram ? Messages.updating() : Messages.updateDiagram()}
    </Button>
  );

  return (
    <FormField
      label={Messages.syntaxLabel()}
      error={mermaidSyntaxError}
      value={mermaidSyntax}
      control={(props) => (
        <MultilineInput
          {...props}
          placeholder={Messages.syntaxPlaceholder()}
          onChange={onSyntaxChange}
          maxLength={MAX_SYNTAX_LENGTH}
          minRows={MIN_SYNTAX_ROWS}
          footer={
            <Box
              padding="1u"
              display="flex"
              justifyContent="end"
            >
              <UpdateButton />
            </Box>
          }
          required={true}
        />
      )}
    />
  );
};