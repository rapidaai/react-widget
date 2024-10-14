import { useEnvironment } from "@/hooks/use-environment";
import languageLabels from "@/languages/language.json";

interface LanguageLabels {
  [key: string]: {
    [key: string]: string;
  };
}

const typedLanguageLabels: LanguageLabels = languageLabels;
const useLanguageLabel = (label: string): string => {
  const { language } = useEnvironment();
  return (
    typedLanguageLabels[language]?.[label] || typedLanguageLabels["en"][label]
  );
};

export default useLanguageLabel;
