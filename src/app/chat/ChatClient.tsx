'use client';
import { User } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface ChatClientProps {
  currentUser?: User | null;
}

const ChatClient = ({ currentUser }: ChatClientProps) => {
  const [receiver, setReceiver] = useState({
    receiverId: '',
    receiverName: '',
    receiverImage: '',
  });

  // 반응형 state
  const [layout, setLayout] = useState(false);

  useEffect(() => {
    axios.get(`/api/chat`).then((res) => console.log(res));
  }, []);

  return (
    <main>
      <div className="grid gird-cols-[1fr] md:grid-cols-[300px_1fr]">
        <section className={`md:flex ${layout && 'hidden'}`}>Contact Component</section>
        <section className={`md:flex ${!layout && 'hidden'}`}>Chat Component</section>
      </div>
    </main>
  );
};

export default ChatClient;
