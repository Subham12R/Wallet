'use client'
import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

interface Card {
  id: number;
  title: string;
  image: string;
  amount: string;
  bgColor: string;
  zIndex: number;
  bottom: number;
}

const page = () => {
  const [showAmount, setShowAmount] = React.useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardAmountRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const totalAmountRef = useRef<HTMLHeadingElement>(null);

  const cards: Card[] = [
    {
      id: 1,
      title: 'Paypal',
      image: '/paypal.png',
      amount: '$100000',
      bgColor: 'bg-white',
      zIndex: 10,
      bottom: 30,
    },
    {
      id: 2,
      title: 'Stripe',
      image: '/stripe.png',
      amount: '$4000',
      bgColor: 'bg-amber-600',
      zIndex: 8,
      bottom: 45,
    },
    {
      id: 3,
      title: 'RazorPay',
      image: '/razor.svg',
      amount: '$20000',
      bgColor: 'bg-blue-600',
      zIndex: 6,
      bottom: 58,
    },
  ];

  const totalAmount = showAmount ? '$212,121' : '******';

  const calculateTotalAmount = () => {
    const total = cards.reduce((sum, card) => {
      const amount = parseInt(card.amount.replace(/[^0-9]/g, ''), 10);
      return sum + amount;
    }, 0);
    
    return '$' + total.toLocaleString();
  };

  const totalAmountValue = '******';

  const animateAmountText = (element: HTMLSpanElement, text: string, delay: number) => {
    element.textContent = '';
    const characters = text.split('');
    
    characters.forEach((char, index) => {
      gsap.to({}, {
        duration: 0.05,
        delay: delay + index * 0.05,
        onComplete: () => {
          element.textContent += char;
        }
      });
    });
  };

  const animateTotalAmount = (text: string, delay: number) => {
    if (!totalAmountRef.current) return;
    
    const element = totalAmountRef.current;
    element.textContent = '';
    const characters = text.split('');
    
    characters.forEach((char, index) => {
      gsap.to({}, {
        duration: 0.08,
        delay: delay + index * 0.08,
        onComplete: () => {
          element.textContent += char;
        }
      });
    });
  };

  const handleShowAmount = () => {
    const newShowAmount = !showAmount;
    setShowAmount(newShowAmount);
    
  
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      
      if (newShowAmount) {
 
        gsap.timeline()
          .to(card, {
            width: 280,
            height: 50,
            bottom: `${card.style.bottom}px`,
            opacity: 0.9,
            duration: 0.6,
            ease: 'power2.inOut',
          }, index * 0.08) 
          .to(card, {
            width: 380,
            height: 'calc(100% - 150px)',
            bottom: `calc(${card.style.bottom} - 20px)`,
            opacity: 1,
            duration: 0.8,
            ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            onComplete: () => {
              // Animate the card amount text after expansion completes
              const amountElement = cardAmountRefs.current[index];
              if (amountElement) {
                animateAmountText(amountElement, cards[index].amount, 0);
              }
            }
          }, index * 0.08 + 0.25);
      } else {
  
        const initialBottom = cards[index].bottom * 4;
        gsap.timeline()
          .to(card, {
            width: 380,
            height: 200,
            bottom: `${initialBottom}px`,
            opacity: 1,
            duration: 0.7,
            ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }, index * 0.08);

        // Reset amount text
        const amountElement = cardAmountRefs.current[index];
        if (amountElement) {
          amountElement.textContent = '******';
        }
      }
    });

  
    if (totalAmountRef.current) {
      const text = totalAmountRef.current;
      
      if (newShowAmount) {
        // Animate total amount with counter effect after a delay
        gsap.delayedCall(0.5, () => {
          animateTotalAmount(calculateTotalAmount(), 0);
        });
      } else {
        // Reset total amount immediately
        if (text) text.textContent = '******';
      }
    }
  };
  return (
    <div className='bg-white h-screen max-w-4xl w-full mx-auto flex justify-center items-center flex-col gap-10'> 

      <div className='relative w-full max-w-[420px] h-[400px] flex items-center justify-center bg-zinc-800 rounded-b-[100px] rounded-t-2xl'>

            {cards.map((card, index) => (
              <div
                key={card.id}
                ref={(el) => { if (el) cardRefs.current[index] = el; }}
                className={`${card.bgColor} w-full h-[200px] rounded-t-2xl absolute border-green-900 border-dashed shadow-white shadow-[inset_0px_5px_20px_rgba(255,255,255,0.1)]`}
                style={{ width: '380px', bottom: `${card.bottom * 4}px`, zIndex: card.zIndex }}
              >
                <div className='flex justify-between px-4 py-2 text-zinc-900 font-bold items-center'>
                  <Image src={card.image} alt={card.title} width={100} height={40} className='object-contain' />
                  <span className='text-xl tracking-tighter text-zinc-900' ref={(el) => { if (el) cardAmountRefs.current[index] = el; }}>{'******'}</span>
                </div>
              </div>
            ))}

           <div className="absolute z-10 bottom-2 w-full h-[280px] bg-zinc-900 rounded-b-[100px] rounded-t-4xl overflow-hidden border-green-900 shadow-green-950" style={{ width: '400px' }}>
            <div className='w-40 h-10 bg-white absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full '></div>
                <div className='flex justify-center items-center text-center flex-col pt-8 mx-auto my-0 leading-tight'>
                  <h1 ref={totalAmountRef} className='text-zinc-400 tracking-wider text-4xl mb-0'>{totalAmountValue}</h1>
                  <span className='text-zinc-400 tracking-wider text-xl font-medium'>Total Amount</span>
                </div>

                <div className='flex justify-center mt-20 items-center'>
                  <button onClick={handleShowAmount}>
                    {showAmount ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>

                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>

                    )}

                  </button>
                </div>
           </div>

    

          </div>
      </div>
   
  )
}

export default page