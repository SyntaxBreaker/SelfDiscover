import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { PostgrestError } from "@supabase/supabase-js";
import IFormData from "../../types/formData";
import { useEffect, useState } from "react";
import IArticle from "../../types/article";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillToolbarConfig } from "../../utils/quillConfig";

function ArticleForm({
  error,
  handleSubmit,
  article,
}: {
  error: PostgrestError | null;
  handleSubmit: (
    formData: IFormData,
    event: React.SyntheticEvent
  ) => Promise<void>;
  article?: IArticle;
}) {
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        tags: article?.tags.toString() as string,
      });
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Box
      as="form"
      onSubmit={(e: React.SyntheticEvent) => handleSubmit(formData, e)}
      bgColor="white"
      padding={8}
      borderBottomRadius={8}
      borderRadius={error ? 0 : 8}
      marginTop={error ? 0 : 8}
      display="flex"
      flexDirection="column"
      gap={4}
      position="static"
    >
      <FormControl position="static">
        <FormLabel>Title</FormLabel>
        <Input
          type="text"
          value={formData.title}
          name="title"
          onChange={handleChange}
          required
          position="static"
        />
      </FormControl>
      <FormControl position="static">
        <FormLabel>Content</FormLabel>
        <ReactQuill
          theme="snow"
          value={formData.content}
          onChange={(newContent) =>
            setFormData((prev) => ({ ...prev, content: newContent }))
          }
          modules={quillToolbarConfig}
        />
      </FormControl>
      <FormControl position="static">
        <FormLabel>Tags</FormLabel>
        <Input
          type="text"
          value={formData.tags}
          name="tags"
          onChange={handleChange}
          position="static"
        />
        <FormHelperText>Tags must be separated using commas.</FormHelperText>
      </FormControl>
      <Button
        width="100%"
        type="submit"
        position="static"
        colorScheme="facebook"
      >
        Submit
      </Button>
    </Box>
  );
}

export default ArticleForm;
