import React, { useState, useEffect, useRef } from 'react';

const OtpInput: React.FC<{ numInputs?: number }> = ({ numInputs = 6 }) => {
  const [otp, setOtp] = useState<string[]>(new Array(numInputs).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>(Array(numInputs).fill(null));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < numInputs - 1 && value !== '') {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex mt-8" style={{ gap: '12px' }}>
      {Array.from({ length: numInputs }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="w-12 h-12 border border-gray-300 rounded-l focus:outline-none"
          style={{
            width: '46px',
            height: '48px',
            border: '1px solid #C1C1C1',
            borderRadius: '6px',
            textAlign: 'center',
          }}
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyUp={(e) => handleKeyUp(index, e)}
          onKeyPress={handleKeyPress}
          ref={(el: HTMLInputElement | null) => {
            if (el) inputRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
