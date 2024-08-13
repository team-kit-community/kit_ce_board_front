import React, { KeyboardEvent, forwardRef } from "react";

interface InputChatProps {
  className?: string;
  ref: React.Ref<HTMLInputElement>;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputChat = forwardRef<HTMLInputElement, InputChatProps>(( props: InputChatProps, ref) => {
    const { className, type, value, placeholder } = props;
    const {onChange, onKeyDown} = props;

    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    }
  return (
    <input
      className={className}
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDownHandler}
      placeholder={placeholder}
    />
  );
});

export default InputChat;
