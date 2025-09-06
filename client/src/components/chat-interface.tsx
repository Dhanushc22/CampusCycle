import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  productId?: string;
  serviceId?: string;
  lastMessageAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface ChatInterfaceProps {
  conversations: Conversation[];
  currentUserId?: string;
}

export default function ChatInterface({ conversations, currentUserId }: ChatInterfaceProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string>("");
  const [messageInput, setMessageInput] = useState("");
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Select first conversation by default
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  // WebSocket connection
  useEffect(() => {
    if (!currentUserId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${currentUserId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnection(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_message') {
        // Invalidate messages query to refresh
        queryClient.invalidateQueries({ 
          queryKey: ["/api/conversations", data.data.conversationId, "messages"] 
        });
      }
    };

    ws.onclose = () => {
      setWsConnection(null);
    };

    return () => {
      ws.close();
    };
  }, [currentUserId, queryClient]);

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/conversations", selectedConversationId, "messages"],
    enabled: !!selectedConversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/messages", {
        conversationId: selectedConversationId,
        content,
      });
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ 
        queryKey: ["/api/conversations", selectedConversationId, "messages"] 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversationId) return;
    sendMessageMutation.mutate(messageInput.trim());
  };

  const getOtherParticipantId = (conversation: Conversation) => {
    return conversation.participant1Id === currentUserId 
      ? conversation.participant2Id 
      : conversation.participant1Id;
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <Card className="h-96">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Conversations List */}
        <div className="border-r border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Conversations</h3>
          </div>
          <ScrollArea className="h-80">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-border cursor-pointer transition-colors ${
                    selectedConversationId === conversation.id 
                      ? "bg-muted" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  data-testid={`conversation-${conversation.id}`}
                >
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src="" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">
                          User
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conversation.lastMessageAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.productId ? "About a product" : "About a service"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-muted">
                <div className="flex items-center">
                  <Avatar className="w-8 h-8 mr-3">
                    <AvatarImage src="" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-foreground">User</span>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.productId ? "About: Product" : "About: Service"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messagesLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-pulse">Loading messages...</div>
                  </div>
                ) : (messages as any[]).length === 0 ? (
                  <div className="flex justify-center items-center h-32 text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(messages as any[]).map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === currentUserId ? "justify-end" : "justify-start"
                        }`}
                        data-testid={`message-${message.id}`}
                      >
                        <div
                          className={`rounded-lg p-3 max-w-xs ${
                            message.senderId === currentUserId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span
                            className={`text-xs mt-1 block ${
                              message.senderId === currentUserId
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                    data-testid="input-message"
                  />
                  <Button
                    type="submit"
                    disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
