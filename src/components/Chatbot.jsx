import { useState, useEffect, useRef } from "react";
import { BsSendFill, BsTrash, BsChatDots, BsArrowRepeat, BsPaperclip, BsX } from "react-icons/bs";
import { MdOutlineMic, MdOutlineStop } from "react-icons/md";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { v4 as uuidv4 } from 'uuid';
import { createWorker } from 'tesseract.js';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrReady, setIsOcrReady] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [character, setCharacter] = useState("blockchain-advisor");
  const [isCharacterMenuOpen, setIsCharacterMenuOpen] = useState(false);
  const [llm, setLlm] = useState("nilai");
  const [isLlmMenuOpen, setIsLlmMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const tesseractWorker = useRef(null);
  const characterMenuRef = useRef(null);
  const llmMenuRef = useRef(null);

  const recognition = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis);
  const utterance = useRef(null);

  // Define blockchain-focused characters instead of the previous ones
  const characters = [
    { id: "blockchain-advisor", name: "Blockchain Advisor", description: "Expert on blockchain fundamentals and technology", emoji: "⛓️" },
    { id: "defi-specialist", name: "DeFi Specialist", description: "Expertise in decentralized finance protocols and strategies", emoji: "💸" },
    { id: "nft-guru", name: "NFT Guru", description: "Specialist in NFT creation, markets, and trends", emoji: "🖼️" },
    { id: "crypto-trader", name: "Crypto Trader", description: "Focused on cryptocurrency markets and trading concepts", emoji: "📈" },
    { id: "smart-contract-dev", name: "Smart Contract Dev", description: "Expert in smart contract development and security", emoji: "📝" },
    { id: "dao-strategist", name: "DAO Strategist", description: "Specialized in decentralized autonomous organizations", emoji: "🏛️" },
    { id: "web3-architect", name: "Web3 Architect", description: "Focused on web3 infrastructure and development", emoji: "🌐" },
    { id: "metaverse-guide", name: "Metaverse Guide", description: "Expert on virtual worlds and metaverse concepts", emoji: "🌌" },
    { id: "token-economist", name: "Token Economist", description: "Specialist in tokenomics and crypto economics", emoji: "💰" },
    { id: "blockchain-security", name: "Security Expert", description: "Focused on blockchain security and best practices", emoji: "🔒" },
  ];

  // Define available LLM models with correct IDs
  const llmModels = [
    { id: "0g", name: "0G", description: "Default language model" },
    { id: "nilai", name: "Nilai", description: "Alternative language model" },
  ];

  // Close character menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (characterMenuRef.current && !characterMenuRef.current.contains(event.target)) {
        setIsCharacterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load character preference from localStorage
  useEffect(() => {
    const storedCharacter = localStorage.getItem('aiCharacter');
    if (storedCharacter) {
      setCharacter(storedCharacter);
    }
  }, []);

  // Close LLM menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (llmMenuRef.current && !llmMenuRef.current.contains(event.target)) {
        setIsLlmMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load LLM preference from localStorage
  useEffect(() => {
    const storedLlm = localStorage.getItem('aiLlm');
    if (storedLlm) {
      setLlm(storedLlm);
    }
  }, []);

  // Initialize Tesseract worker
  useEffect(() => {
    let isMounted = true;
    
    const initWorker = async () => {
      try {
        if (isMounted) setIsOcrLoading(true);
        console.log('Initializing Tesseract worker...');
        
        // Pre-download language and worker scripts
        if (window.Tesseract) {
          window.Tesseract.setLogging(true);
        }

        // Define a safer logger function that doesn't directly capture React state setters
        const loggerHandler = (m) => {
          if (!isMounted) return;

          if (
            m.status === 'recognizing text' &&
            typeof m.progress === 'number'
          ) {
            // Use a safe approach to update progress
            window.requestAnimationFrame(() => {
              if (isMounted) {
                setOcrProgress(Math.round(m.progress * 100));
              }
            });
          }
          
          // Log progress for debugging
          if (m.status) {
            console.log(`Tesseract: ${m.status} - ${m.progress ? (m.progress * 100).toFixed(2) + '%' : ''}`);
          }
        };
        
        // Create worker with timeout and explicit options
        const worker = await Promise.race([
          createWorker({
            logger: loggerHandler,
            corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4.0.4/tesseract-core.wasm.js',
            langPath: 'https://tessdata.projectnaptha.com/4.0.0',
            workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.1/dist/worker.min.js',
            cachePath: './tesseract-cache',
            cacheMethod: 'browser',
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Tesseract initialization timed out')), 30000)
          )
        ]);
        
        // Save the worker reference
        tesseractWorker.current = worker;
        
        console.log('Loading English language data...');
        
        // Initialize with English language
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        
        if (isMounted) {
          setIsOcrReady(true);
          console.log('Tesseract worker initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Tesseract worker:', error);
        
        if (isMounted) {
          setIsOcrReady(false);
          
          // Retry logic - attempt up to 2 retries (3 total attempts)
          if (retryCount < 2) {
            console.log(`Retrying Tesseract initialization (attempt ${retryCount + 2}/3)...`);
            setRetryCount(retryCount + 1);
            
            // Wait 2 seconds before retrying
            setTimeout(() => {
              if (isMounted) initWorker();
            }, 2000);
          } else {
            // Only show alert when all retries are exhausted
            alert('OCR engine failed to initialize after multiple attempts. File uploads will use simplified text extraction.');
          }
        }
      } finally {
        if (isMounted) setIsOcrLoading(false);
      }
    };

    // Start initialization
    initWorker();

    return () => {
      isMounted = false;
      // Terminate worker on component unmount
      if (tesseractWorker.current) {
        try {
          tesseractWorker.current.terminate();
        } catch (e) {
          console.error("Error terminating Tesseract worker:", e);
        }
      }
    };
  }, [retryCount]);  // Add retryCount as dependency to trigger re-initialization

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const storedConversationId = localStorage.getItem('conversationId');
    const storedMessages = localStorage.getItem('chatHistory');
    
    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
    
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
        if (parsedMessages.length > 0) {
          setIsChatStarted(true);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);

  const toggleSpeechToText = () => {
    if (isListening) {
      recognition.current.stop();
    } else {
      setInput('');
      recognition.current.start();
    }
    setIsListening(!isListening);
  };

  const speakText = (text) => {
    if (isSpeaking) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
      return;
    }

    utterance.current = new SpeechSynthesisUtterance(text);
    utterance.current.onend = () => setIsSpeaking(false);
    speechSynthesis.current.speak(utterance.current);
    setIsSpeaking(true);
  };

  // Basic file reader for fallback when OCR isn't available
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = event => {
        try {
          resolve(event.target.result);
        } catch (e) {
          reject(new Error('Failed to read file contents'));
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      
      if (file.type === 'application/pdf') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // Process image with tesseract directly without using worker API
  const processImageDirectly = async (imageUrl) => {
    try {
      // Only import Tesseract on demand to avoid unnecessary loading
      const Tesseract = await import('tesseract.js');
      
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: progress => {
            if (progress.status === 'recognizing text') {
              setOcrProgress(Math.round(progress.progress * 100));
            }
          }
        }
      );
      
      return result.data.text || 'No text detected in image';
    } catch (error) {
      console.error('Direct OCR processing error:', error);
      throw new Error(`OCR failed: ${error.message}`);
    }
  };

  const clearFileAttachment = () => {
    setFileContent("");
    setFileInfo(null);
  };

  // Function to handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    setFileContent("");
    setFileInfo(null);
    setOcrProgress(0);

    try {
      let extractedText = "";
      const fileType = file.type.split('/')[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Create a consistent message about the file
      const fileDescription = `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB, ${file.type})`;
      
      if (fileType === 'image') {
        try {
          // Create image URL
          const imageUrl = URL.createObjectURL(file);
          
          if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('Large image detected. Processing may take longer.');
          }
          
          // Try both methods for OCR
          if (isOcrReady && tesseractWorker.current) {
            console.log('Using Tesseract worker for OCR');
            extractedText = await extractTextFromFile(imageUrl, 'Image');
          } else {
            console.log('Attempting direct OCR without worker');
            // Try direct processing as fallback
            try {
              extractedText = await processImageDirectly(imageUrl);
            } catch (directError) {
              console.error('Direct OCR failed:', directError);
              extractedText = "Image text extraction failed. Please describe the image content manually.";
            }
          }
          
          // Cleanup the URL
          URL.revokeObjectURL(imageUrl);
          
          if (!extractedText || extractedText.trim() === '') {
            extractedText = "No text detected in image. Please describe the content manually.";
          }
          
          setFileContent(extractedText);
          setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: 'image',
            mimeType: file.type,
            preview: URL.createObjectURL(file)
          });
        } catch (error) {
          console.error('Image processing error:', error);
          setFileContent("Failed to extract text from image.");
          setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: 'image',
            mimeType: file.type,
            error: true
          });
        }
      } else if (fileType === 'application' && (fileExtension === 'pdf' || file.type === 'application/pdf')) {
        try {
          extractedText = "PDF content attached. Please note that PDF text extraction is limited.";
          setFileContent(extractedText);
          setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: 'pdf',
            mimeType: file.type
          });
        } catch (error) {
          console.error('PDF processing error:', error);
          setFileContent("PDF file attached.");
          setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: 'pdf',
            mimeType: file.type,
            error: true
          });
        }
      } else if (fileType === 'text' || fileExtension === 'txt') {
        try {
          extractedText = await readFileAsText(file);
          setFileContent(extractedText);
          setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: 'text',
            mimeType: file.type
          });
        } catch (error) {
          console.error('Text file processing error:', error);
          setFileContent("Failed to read text file.");
          setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: 'text',
            mimeType: file.type,
            error: true
          });
        }
      } else {
        setFileContent("Unsupported file type. Please upload an image, PDF, or text file.");
        alert('Unsupported file type. Please upload an image, PDF, or text file.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Failed to process the file: ${error.message}`);
      setFileContent(`Error processing file: ${error.message}`);
    } finally {
      setIsProcessingFile(false);
      setOcrProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Function to extract text from file using Tesseract.js
  const extractTextFromFile = async (fileUrl, fileType) => {
    if (!tesseractWorker.current) {
      throw new Error('OCR engine is not ready. Please try again.');
    }

    try {
      console.log(`Starting OCR for ${fileType}...`);
      const { data } = await tesseractWorker.current.recognize(fileUrl);
      console.log(`OCR complete for ${fileType}`);
      
      if (!data || !data.text || data.text.trim() === '') {
        return `No text detected in ${fileType.toLowerCase()}`;
      }
      
      return data.text.trim();
    } catch (error) {
      console.error(`Text extraction error for ${fileType}:`, error);
      throw new Error(`Failed to extract text: ${error.message || 'Unknown error'}`);
    }
  };

  const regenerateResponse = async () => {
    if (isLoading) return;
    
    // Get the last user message
    const lastUserMessage = messages.findLast(msg => msg.sender === 'user')?.text;
    if (!lastUserMessage) return;
    
    setIsLoading(true);
    setStreamingText("");
    
    try {
      // Include LLM model in the API call
      const response = await fetch(`http://127.0.0.1:5000/chat?query=${encodeURIComponent(lastUserMessage)}&conversation_id=${conversationId}&regenerate=true&character=${character}&llm=${llm}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        completeResponse += chunk;
        setStreamingText(completeResponse);
      }

      // Update the last bot message in the messages array
      setMessages(prev => {
        const newMessages = [...prev];
        const lastBotIndex = newMessages.findLastIndex(msg => msg.sender === 'bot');
        if (lastBotIndex !== -1) {
          newMessages[lastBotIndex] = {
            text: completeResponse,
            sender: 'bot',
            character: character,
            llm: llm
          };
        }
        return newMessages;
      });
      setStreamingText("");
      setLastBotMessage(completeResponse);
    } catch (error) {
      console.error('Error regenerating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const hasFileContent = fileContent && fileContent.trim() !== "";
    const hasTextInput = input.trim() !== "";
    
    if (!hasFileContent && !hasTextInput) return;

    setIsLoading(true);
    setStreamingText("");
    
    // Combine fileContent and text input if both exist
    let finalMessage = "";
    
    if (hasFileContent && hasTextInput) {
      // File with user message
      if (fileInfo) {
        // Format differently based on file type
        if (fileInfo.type === 'image') {
          finalMessage = `${input.trim()}\n\n[Image Content]: ${fileContent}\n(File: ${fileInfo.name})`;
        } else if (fileInfo.type === 'pdf') {
          finalMessage = `${input.trim()}\n\n[PDF Content]: ${fileContent}\n(File: ${fileInfo.name})`;
        } else if (fileInfo.type === 'text') {
          finalMessage = `${input.trim()}\n\n[Text File]: ${fileContent}\n(File: ${fileInfo.name})`;
        }
      }
    } else if (hasFileContent) {
      // Only file, no text input
      if (fileInfo) {
        if (fileInfo.type === 'image') {
          finalMessage = `[Image Content]: ${fileContent}\n(File: ${fileInfo.name})`;
        } else if (fileInfo.type === 'pdf') {
          finalMessage = `[PDF Content]: ${fileContent}\n(File: ${fileInfo.name})`;
        } else if (fileInfo.type === 'text') {
          finalMessage = `[Text File]: ${fileContent}\n(File: ${fileInfo.name})`;
        }
      } else {
        finalMessage = fileContent;
      }
    } else {
      // Only text input, no file
      finalMessage = input.trim();
    }
    
    // Add file information to message (if any)
    const userMessageObj = {
      text: finalMessage,
      sender: 'user'
    };
    
    // Add file metadata to message object
    if (fileInfo) {
      userMessageObj.file = {
        ...fileInfo,
        content: fileContent
      };
    }
    
    // Reset input fields
    setInput("");
    setFileContent("");
    setFileInfo(null);

    // Add user message to chat
    setMessages(prev => [...prev, userMessageObj]);

    // Generate new conversation ID if this is the first message
    if (!conversationId) {
      const newConversationId = uuidv4();
      setConversationId(newConversationId);
      localStorage.setItem('conversationId', newConversationId);
    }

    try {
      // Include LLM model in the API call
      const response = await fetch(`http://127.0.0.1:5000/chat?query=${encodeURIComponent(finalMessage)}&conversation_id=${conversationId}&character=${character}&llm=${llm}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        completeResponse += chunk;
        setStreamingText(completeResponse);
      }

      // Add the complete message to messages array and clear streaming text
      setMessages(prev => [...prev, { 
        text: completeResponse, 
        sender: 'bot',
        character: character,
        llm: llm
      }]);
      setStreamingText("");
      setLastBotMessage(completeResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: 'Sorry, there was an error processing your message.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }

    if (!isChatStarted) setIsChatStarted(true);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('conversationId');
    setIsChatStarted(false);
  };

  const getFileButtonTitle = () => {
    if (isOcrLoading) return "OCR engine is loading...";
    if (!isOcrReady) return "Upload file (simplified mode)";
    if (isProcessingFile) return `Processing (${ocrProgress}%)`;
    return "Upload file";
  };

  // Force retry Tesseract initialization
  const retryOcrInitialization = () => {
    if (isOcrLoading) return;
    
    // Reset OCR state
    setIsOcrReady(false);
    setIsOcrLoading(true);
    
    // Increment retry count to trigger useEffect
    setRetryCount(prevCount => prevCount + 1);
    
    alert("Attempting to reinitialize OCR engine. Please wait...");
  };

  // Render file message based on file type
  const renderFileMessage = (message) => {
    if (!message.file) return null;
    
    const file = message.file;
    const fileTypeDisplay = {
      'image': 'Image',
      'pdf': 'PDF Document',
      'text': 'Text File'
    }[file.type] || 'File';
    
    return (
      <div className="flex flex-col mt-2 pt-2 border-t border-white/20">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
            {file.type === 'image' && <span>📷</span>}
            {file.type === 'pdf' && <span>📄</span>}
            {file.type === 'text' && <span>📝</span>}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-medium truncate">{file.name}</p>
            <p className="text-xs opacity-70">{fileTypeDisplay} • {file.size} KB</p>
          </div>
        </div>
        {file.preview && (
          <div className="mt-1 rounded overflow-hidden max-h-32 w-auto">
            <img 
              src={file.preview} 
              alt={file.name} 
              className="object-contain max-h-32 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    );
  };

  // Function to change character
  const changeCharacter = (newCharacter) => {
    setCharacter(newCharacter);
    localStorage.setItem('aiCharacter', newCharacter);
    setIsCharacterMenuOpen(false);
  };

  // Get current character details
  const getCurrentCharacter = () => {
    return characters.find(c => c.id === character) || characters[0];
  };

  // Function to change LLM model
  const changeLlm = (newLlm) => {
    setLlm(newLlm);
    localStorage.setItem('aiLlm', newLlm);
    setIsLlmMenuOpen(false);
  };

  // Get current LLM model details
  const getCurrentLlm = () => {
    return llmModels.find(m => m.id === llm) || llmModels[0];
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-4xl mx-auto p-4 flex flex-col h-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col flex-1 overflow-hidden mt-10 border border-gray-100">
          {/* Header with Character Selector and LLM Model Selector */}
          <div className="flex justify-between items-center p-4 border-b bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <BsChatDots className="text-xl text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Web3 Assistant</h1>
                <p className="text-xs text-gray-500">Your blockchain knowledge companion</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-center">
              {/* LLM Model Selector Dropdown */}
              <div className="relative" ref={llmMenuRef}>
                <button 
                  onClick={() => setIsLlmMenuOpen(!isLlmMenuOpen)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Model: {getCurrentLlm().name}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isLlmMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 animate-fade-in">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500">SELECT MODEL</p>
                    </div>
                    
                    {llmModels.map(model => (
                      <button
                        key={model.id}
                        onClick={() => changeLlm(model.id)}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          llm === model.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800">{model.name}</p>
                          <p className="text-xs text-gray-500">{model.description}</p>
                        </div>
                        {llm === model.id && (
                          <div className="ml-auto">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Character Selector Dropdown */}
              <div className="relative" ref={characterMenuRef}>
                <button 
                  onClick={() => setIsCharacterMenuOpen(!isCharacterMenuOpen)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">{getCurrentCharacter().emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{getCurrentCharacter().name}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCharacterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 animate-fade-in max-h-96 overflow-y-auto">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500">SELECT WEB3 EXPERT</p>
                    </div>
                    
                    {characters.map(char => (
                      <button
                        key={char.id}
                        onClick={() => changeCharacter(char.id)}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          character === char.id ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <span className="text-xl">{char.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{char.name}</p>
                          <p className="text-xs text-gray-500">{char.description}</p>
                        </div>
                        {character === char.id && (
                          <div className="ml-auto">
                            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {!isOcrReady && !isOcrLoading && (
                <button
                  onClick={retryOcrInitialization}
                  className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                >
                  <BsArrowRepeat className="text-sm" />
                  <span>Retry OCR</span>
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <BsTrash className="text-sm" />
                  <span>Clear Chat</span>
                </button>
              )}
            </div>
          </div>

          {/* Chat Messages - Display character emoji with bot messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-4xl">{getCurrentCharacter().emoji}</span>
                </div>
                <p className="text-xl font-medium text-gray-700 mb-2">I'm your {getCurrentCharacter().name}!</p>
                <p className="text-sm text-gray-500 max-w-md text-center">
                  {getCurrentCharacter().description}. Ask me anything about blockchain, crypto, and web3 technologies.
                </p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <>
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.file && renderFileMessage(msg)}
                    </>
                  ) : (
                    <>
                      {/* Show character and always show LLM indicator for bot messages */}
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {characters.find(c => c.id === msg.character)?.emoji || '🤖'}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {characters.find(c => c.id === msg.character)?.name || 'Assistant'}
                          </span>
                        </div>
                        {/* Always show model badge with appropriate styling */}
                        <span className={`text-xs ${
                          msg.llm === '0g' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                          } px-2 py-0.5 rounded-full font-medium`}
                        >
                          {msg.llm === '0g' ? '0G Model' : 'Nilai Model'}
                        </span>
                      </div>
                      <div 
                        className="" 
                        dangerouslySetInnerHTML={{ __html: msg.text }}
                      />
                    </>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${msg.sender === 'user' ? 'opacity-70' : 'text-gray-500'}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === 'bot' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => speakText(msg.text)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {isSpeaking ? 
                            <HiSpeakerXMark className="text-gray-500 w-4 h-4" /> :
                            <HiSpeakerWave className="text-gray-500 w-4 h-4" />
                          }
                        </button>
                        {index === messages.length - 1 && msg.sender === 'bot' && (
                          <button
                            onClick={regenerateResponse}
                            disabled={isLoading}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <BsArrowRepeat className={`w-4 h-4 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {streamingText && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[80%] p-4 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100">
                  {/* Character and model indicator for streaming message */}
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCurrentCharacter().emoji}</span>
                      <span className="text-xs text-gray-500 font-medium">{getCurrentCharacter().name}</span>
                    </div>
                    {/* Always show model badge with appropriate styling */}
                    <span className={`text-xs ${
                      llm === '0g' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                      } px-2 py-0.5 rounded-full font-medium`}
                    >
                      {llm === '0g' ? '0G Model' : 'Nilai Model'}
                    </span>
                  </div>
                  <div 
                    className="whitespace-pre-wrap leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: streamingText }}
                  />
                  <span className="text-xs text-gray-500 mt-2 block">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/50 backdrop-blur-sm border-t">
            {/* File Preview (WhatsApp-style) */}
            {fileInfo && (
              <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-100 relative animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    {fileInfo.type === 'image' && <span className="text-xl">📷</span>}
                    {fileInfo.type === 'pdf' && <span className="text-xl">📄</span>}
                    {fileInfo.type === 'text' && <span className="text-xl">📝</span>}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium text-blue-800 truncate">{fileInfo.name}</div>
                    <div className="text-xs text-blue-500">
                      {fileInfo.type === 'image' ? 'Image' : fileInfo.type === 'pdf' ? 'PDF Document' : 'Text File'} • {fileInfo.size} KB
                      {fileInfo.error && <span className="ml-2 text-yellow-600">⚠️ Processing had issues</span>}
                    </div>
                    <div className="text-xs text-blue-700 mt-1 line-clamp-1">
                      {fileContent ? 
                        (fileContent.length > 60 ? fileContent.substring(0, 60) + '...' : fileContent) 
                        : 'No text extracted'}
                    </div>
                  </div>
                  <button 
                    onClick={clearFileAttachment}
                    className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 hover:bg-blue-300"
                  >
                    <BsX className="text-sm" />
                  </button>
                </div>
                {fileInfo.type === 'image' && fileInfo.preview && (
                  <div className="mt-2 max-h-40 overflow-hidden">
                    <img 
                      src={fileInfo.preview} 
                      alt={fileInfo.name} 
                      className="rounded-lg object-contain max-h-40 max-w-full mx-auto"
                    />
                  </div>
                )}
              </div>
            )}
          
            <div className="flex w-full gap-3">
              <button
                onClick={toggleSpeechToText}
                className={`p-4 rounded-xl transition-all duration-200 ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {isListening ? <MdOutlineStop className="text-xl" /> : <MdOutlineMic className="text-xl" />}
              </button>
              
              {/* File Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
                className={`p-4 rounded-xl transition-all duration-200 relative ${
                  isProcessingFile
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                title={getFileButtonTitle()}
              >
                <BsPaperclip className="text-xl" />
                {isOcrLoading && <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full animate-pulse"></span>}
                {!isOcrReady && !isOcrLoading && <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full"></span>}
                {isProcessingFile && (
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="application/pdf,image/*,text/plain"
                className="hidden"
                disabled={isProcessingFile}
              />
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white placeholder:text-gray-400 bg-white/80 backdrop-blur-sm"
                placeholder={
                  isListening ? "Listening..." : 
                  isProcessingFile ? `Processing file (${ocrProgress}%)...` : 
                  isOcrLoading ? "OCR engine is loading..." :
                  fileInfo ? "Add a message or send now..." :
                  !isOcrReady ? "OCR unavailable (simplified mode)" :
                  "Type your message..."
                }
                disabled={isLoading || isProcessingFile}
              />
              <button
                onClick={handleSendMessage}
                disabled={(!input.trim() && !fileInfo) || isLoading || isProcessingFile}
                className={`p-4 rounded-xl text-white transition-all duration-200 ${
                  (input.trim() || fileInfo) && !isLoading && !isProcessingFile
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <BsSendFill className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
