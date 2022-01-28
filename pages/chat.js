import { Box, Text, TextField, Image, Button, Icon } from "@skynexui/components";
import { createClient } from "@supabase/supabase-js";
import { React, useState, useEffect } from "react";
import appConfig from "../config.json";
import { Grid } from "react-loading-icons";



const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_API_KEY)

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      supabaseClient.from('mensagens')
     .select('*')
     .order('created_at', {ascending: false})
     .then(({data})=>{
       setMessageList(data)
       console.log('first', data);
       setTimeout(()=>{
         setIsLoading(false)
       },900)
     })
  }, []);

  

  function handleNewMessage(newMessage) {
    const messageobj = {
      textmessage: newMessage,
      from: "vanessa",
    };
    supabaseClient.from("mensagens")
    .insert([
      messageobj
    ])
    .then(({data})=>{
      setMessageList([data[0], ...messageList]);
      
    })

    setMessage("");
  }

  return (
    <>
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.neutrals["000"],
        backgroundImage: `url(/background.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        backgroundPosition: "center",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    > {isLoading ? <Grid stroke="#4f7a9d" fill="#4f7a9d"/> :
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
          opacity: "0.97",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList currentList={messageList} setMessageList={setMessageList} isLoading={isLoading} />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
              <TextField
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  if ((event.key === "Enter") & (event.shiftKey == false)) {
                    event.preventDefault();
                    handleNewMessage(message);
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  width:{
                    xs: "100%", 
                    md: "90%",
                  },
                  border: "0",
                  resize: "none",
                  borderRadius: "5px",
                  padding: "6px 8px",
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                  marginRight: "12px",
                  color: appConfig.theme.colors.neutrals[200],
                }}
              />
            <Button 
              label="Enviar"
              onClick={()=>{
                handleNewMessage(message)
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.custom[250],
                mainColorLight: appConfig.theme.colors.custom[200],
                mainColorStrong: appConfig.theme.colors.custom[200],
              }}
              styleSheet={{ 
                width:{
                 xs: "100%", 
                 md: "10%",
                }
                  
              }}
              
              />
          </Box>
        </Box>
      </Box>}
    </Box>
    </>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          label="Logout"
          href="/"
          buttonColors={{
            contrastColor: appConfig.theme.colors.neutrals["000"],
            mainColorStrong: appConfig.theme.colors.custom[800]
          }}
        />
      </Box>
    </>
  );
}

function MessageList({ currentList, setMessageList, isLoading}) {


  function handleRemove(e,id) {
    e.preventDefault()
    const newMessageList = currentList.filter(message => message.id !== id)
    supabaseClient.from('mensagens')
    .delete()
    .match({'id': id })
    .then(()=>{
      setMessageList(newMessageList)
    })
  }
  

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {currentList.map((msg) => {
        return (
          <Text
            key={msg.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
                
              },
              fontWeight: "600",
              color: appConfig.theme.colors.neutrals[300]
            }}
          >
            <Box 
              styleSheet={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"

              }}
              >
              <Box
                styleSheet={{
                  marginBottom: "8px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Image
                  styleSheet={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "inline-block",
                    marginRight: "8px",
                    hover:{
                      display:"inline-block"
                    }
                  }}
                  src={`https://github.com/vanessametonini.png`}
                />
                <Text tag="strong">{msg.from}</Text>
                <Text
                  styleSheet={{
                    fontSize: "10px",
                    marginLeft: "8px",
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString("pt-BR")}
                </Text>
              </Box>
              <Icon
                name= "FaTrash"
                onClick={(e)=>{handleRemove(e, msg.id)}}
                styleSheet={{
                  hover: {
                    color: "red",
                    cursor: "pointer",
                  }
                }}/>
            </Box>
            {msg.textmessage}
          </Text>
        );
      })}     
    </Box>
  );
}
