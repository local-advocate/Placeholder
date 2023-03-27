-- -- Your schema DDL (create table statements) goes here 

DROP TABLE IF EXISTS conversation CASCADE;
CREATE TABLE conversation (conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), sender UUID, receiver UUID, conversation jsonb, UNIQUE (sender, receiver));


DROP TABLE IF EXISTS message;
CREATE TABLE message(message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), sender UUID, conversation_id UUID REFERENCES conversation(conversation_id) ON DELETE CASCADE, message jsonb);