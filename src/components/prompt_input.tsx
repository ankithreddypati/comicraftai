import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormField,
  LightBulbIcon,
  MultilineInput,
} from "@canva/app-ui-kit";
import { useAppContext } from "src/context";
import { Paths } from "src/routes";
import { AppMessages as Messages } from "src/app.messages";
import { Footer } from "./footer";

// @TODO: Adjust according to your specific requirements.
const MAX_INPUT_LENGTH = 280;
const MIN_INPUT_ROWS = 2;

const examplePrompts: string[] = [
  "A Cyber Monk and his robot friend walk through a deserted spaceship",
  "An wizard and a young apprentice discover a hidden magical library",
  "A group of adventurers camp by a mystical forest at sunset",
  "A lone samurai confronts a dragon on a snowy mountain peak",
  "Two astronauts find an alien artifact on a distant planet",
  "A detective interviews suspects in a jazz club",
  "A mermaid and a pirate explore a sunken shipwreck",
  "A group of friends navigate a haunted amusement park",
  "A royal ball in a grand palace where secrets are whispered",
  "A futuristic cityscape where a rebel group plans their next move",
];

const generateExamplePrompt = (currentPrompt: string): string => {
  let newPrompt = currentPrompt;
  let attempts = 0;
  const MAX_ATTEMPTS = 3;

  while (currentPrompt === newPrompt && attempts < MAX_ATTEMPTS) {
    newPrompt =
      examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    attempts++;
  }

  return newPrompt;
};

export const PromptInput = () => {
  const { pathname } = useLocation();
  const isHomeRoute = pathname === Paths.HOME;
  const { promptInput, setPromptInput, promptInputError, setPromptInputError } = useAppContext();
  const [showInspireMeButton, setShowInspireMeButton] = useState(true);
  const [inspireMeButtonLabel, setInspireMeButtonLabel] = useState(
    Messages.promptInspireMe()
  );
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");

  const onInspireClick = () => {
    setPromptInput(generateExamplePrompt(promptInput));
    setInspireMeButtonLabel(Messages.promptTryAnother());
  };

  const onPromptInputChange = (value: string) => {
    setShowInspireMeButton(false);
    setPromptInput(value);
    setPromptInputError(""); // Clear error when input changes
  };

  const onClearClick = () => {
    setPromptInput("");
    setShowInspireMeButton(true);
    setInspireMeButtonLabel(Messages.promptInspireMe());
    setGeneratedStory("");
    setPromptInputError(""); // Clear error when input is cleared
  };

  const isPromptInputFilled = () => {
    if (!promptInput) {
      setPromptInputError(Messages.promptMissingErrorMessage());
      return false;
    }
    return true;
  };

  const generateStory = async () => {
    if (!isPromptInputFilled()) {
      return;
    }
    setLoading(true);
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptInput }),
      });
      const data = await response.json();
      setGeneratedStory(data.story);
    } catch (error) {
      console.error("Error generating story:", error);
      setGeneratedStory("An error occurred while generating the story.");
    } finally {
      setLoading(false);
    }
  };

  const InspireMeButton = () => (
    <Button variant="secondary" icon={LightBulbIcon} onClick={onInspireClick}>
      {inspireMeButtonLabel}
    </Button>
  );

  const ClearButton = () => (
    <Button variant="tertiary" onClick={onClearClick}>
      {Messages.clear()}
    </Button>
  );

  const StoryButton = () => (
    <Button 
      variant="primary" 
      onClick={generateStory} 
      loading={loading}
    >
      Create
    </Button>
  );

  return (
    <>
      <FormField
        label={Messages.promptLabel()}
        error={promptInputError}
        value={promptInput}
        control={(props) => (
          <MultilineInput
            {...props}
            placeholder={Messages.promptPlaceholder()}
            onChange={onPromptInputChange}
            maxLength={MAX_INPUT_LENGTH}
            minRows={MIN_INPUT_ROWS}
            footer={
              <Box
                padding="1u"
                display="flex"
                justifyContent={
                  isHomeRoute && showInspireMeButton ? "spaceBetween" : "end"
                }
              >
                {isHomeRoute && showInspireMeButton && <InspireMeButton />}
                {promptInput && <ClearButton />}
              
              </Box>
            }
            required={true}
          />
        )}
      />
      {generatedStory && (
        <FormField
          label="Generated Story or edit it"
          value={generatedStory}
          control={(props) => (
            <MultilineInput
              {...props}
              readOnly
              minRows={10}
            />
          )}
        />
      )}
    </>
  );
};