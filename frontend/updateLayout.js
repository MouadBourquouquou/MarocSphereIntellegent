const fs = require('fs');
const path = 'c:/Users/pc/MarocSphereIntellegent/frontend/src/app/pages/dashboards/guide/dashGuide.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Move Availability block
const availStartStr = `    <!-- ════════════════════════════════════════════\n         AVAILABILITY PAGE`;
const availStart = content.indexOf(availStartStr);
const availEndStr = `    }\n\n  </main>`;
const availEnd = content.indexOf(availEndStr, availStart);

if (availStart !== -1 && availEnd !== -1) {
  let availContent = content.substring(availStart, availEnd + 6); // Up to }\n
  
  // Remove from bottom
  content = content.replace(availContent, '');

  // Strip the @if wrapper
  availContent = availContent.replace(`    @if (activePage() === 'availability') {\n      <div class="gd-page gd-page--analytics">\n`, `      <!-- ── AVAILABILITY CALENDAR ── -->\n      <div style="margin-top: 3rem; width: 100%;">\n`);
  
  // At the end, it has 
  //       </div>
  //     }
  const lastBracket = availContent.lastIndexOf('    }');
  if (lastBracket !== -1) {
      availContent = availContent.substring(0, lastBracket);
  }

  // Insert into Profile
  const profileEndStr = `      </div>\n    }\n\n    <!-- ════════════════════════════════════════════\n         EXPERIENCES PAGE`;
  const profileEnd = content.indexOf(profileEndStr);
  if (profileEnd !== -1) {
    content = content.substring(0, profileEnd) + availContent + content.substring(profileEnd);
  }
}

// 2. Redesign Messages Block
const msgStartStr = `    <!-- ════════════════════════════════════════════\n         MESSAGES PAGE`;
const msgStart = content.indexOf(msgStartStr);
let nextBlockStr = `    <!-- ════════════════════════════════════════════\n         AVAILABILITY PAGE`;
if (content.indexOf(nextBlockStr) === -1) {
  nextBlockStr = `    }\n\n  </main>`;
}
let msgEnd = content.indexOf(nextBlockStr, msgStart);

// It might be just before </main> now because Availability is moved, or if it's placed earlier.
// Wait, the next block is actually `    }\n\n  </main>` if Availability is gone.
if (content.indexOf(`    <!-- ════════════════════════════════════════════\n         AVAILABILITY PAGE`) !== -1) {
    msgEnd = content.indexOf(`    <!-- ════════════════════════════════════════════\n         AVAILABILITY PAGE`, msgStart);
    // Find the end of the previous block (the closing `}\n\n`)
    msgEnd = content.lastIndexOf(`    }\n\n`, msgEnd);
} else {
    msgEnd = content.lastIndexOf(`    }\n\n`, content.indexOf(`  </main>`));
}

if (msgStart !== -1 && msgEnd !== -1) {
  const newMessages = `    <!-- ════════════════════════════════════════════
         MESSAGES PAGE (Redesigned to match Experiences/Requests)
    ════════════════════════════════════════════ -->
    @if (activePage() === 'messages') {
      <div class="gd-page gd-page--orders">
        <div class="gd-page-header gd-animate-in">
          <div>
            <h1 class="gd-page-header__title">Messages</h1>
            <p class="gd-page-header__subtitle">Communicate with your travelers</p>
          </div>
        </div>
        
        <div class="gd-chart-row gd-animate-in gd-animate-in--delay-1" style="align-items: stretch; height: calc(100vh - 220px); min-height: 500px;">
          
          <!-- Left Panel: Conversations -->
          <div class="gd-chart-card" style="flex: 1; max-width: 380px; display: flex; flex-direction: column; padding: 1.5rem; background: white; border: 1px solid var(--gd-border);">
            <div class="gd-search" style="margin-bottom: 1.5rem;">
              <iconify-icon icon="lucide:search"></iconify-icon>
              <input type="text" placeholder="Search conversations..." [value]="conversationSearch()" (input)="conversationSearch.set($any($event.target).value)" />
            </div>
            
            <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.5rem;">
              @for (conv of filteredConversations(); track conv.id) {
                <button 
                  (click)="selectConversation(conv.id)"
                  class="gd-conv-btn"
                  style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; border: 1px solid transparent; text-align: left; background: transparent; cursor: pointer; transition: all 200ms;"
                  [style.background]="activeConversationId() === conv.id ? 'var(--gd-blush)' : 'transparent'"
                  [style.border-color]="activeConversationId() === conv.id ? 'var(--gd-border)' : 'transparent'">
                  <div style="position: relative; width: 48px; height: 48px; border-radius: 50%; background: var(--gd-terra); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0;">
                    {{ conv.travelerName.charAt(0) }}
                    @if (conv.unread > 0) {
                      <span style="position: absolute; top: 0; right: -4px; background: var(--gd-terra); width: 14px; height: 14px; border-radius: 50%; border: 2px solid white;"></span>
                    }
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <span style="font-weight: 600; color: var(--gd-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ conv.travelerName }}</span>
                      <span style="font-size: 0.75rem; color: var(--gd-muted);">{{ conv.time }}</span>
                    </div>
                    <div style="font-size: 0.85rem; color: var(--gd-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      {{ conv.lastMessage }}
                    </div>
                  </div>
                </button>
              } @empty {
                <div class="gd-empty-state" style="background: transparent; padding: 2rem 0;">
                  <iconify-icon icon="lucide:message-circle"></iconify-icon>
                  <p>No conversations found.</p>
                </div>
              }
            </div>
          </div>

          <!-- Right Panel: Active Conversation -->
          <div class="gd-chart-card" style="flex: 2; display: flex; flex-direction: column; padding: 0; background: white; border: 1px solid var(--gd-border); overflow: hidden;">
            @if (activeConversation()) {
              <!-- Chat Header -->
              <div style="padding: 1.5rem; border-bottom: 1px solid var(--gd-border); background: white; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--gd-terra); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">
                    {{ activeConversation()!.travelerName.charAt(0) }}
                  </div>
                  <div>
                    <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--gd-ink); margin: 0;">{{ activeConversation()!.travelerName }}</h3>
                    <span style="font-size: 0.85rem; color: var(--gd-muted);">{{ activeConversation()!.travelerCountry || 'Traveler' }}</span>
                  </div>
                </div>
                @if (activeConversationRequest()) {
                  <button class="gd-btn gd-btn--secondary gd-btn--sm" (click)="navigate('requests')">
                    <iconify-icon icon="lucide:calendar-check-2"></iconify-icon> View Booking
                  </button>
                }
              </div>

              <!-- Messages Area -->
              <div style="flex: 1; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; background: var(--gd-bg);">
                @for (msg of activeMessages(); track msg.id) {
                  <div [style.align-self]="msg.from === 'me' ? 'flex-end' : 'flex-start'" style="max-width: 75%; display: flex; flex-direction: column; gap: 4px;">
                    <div style="padding: 1rem 1.25rem; border-radius: 20px; font-size: 0.95rem; line-height: 1.5; box-shadow: 0 2px 8px rgba(0,0,0,0.02);"
                         [style.background]="msg.from === 'me' ? 'var(--gd-terra)' : 'white'"
                         [style.color]="msg.from === 'me' ? 'white' : 'var(--gd-ink)'"
                         [style.border]="msg.from === 'me' ? 'none' : '1px solid var(--gd-border)'"
                         [style.border-bottom-right-radius]="msg.from === 'me' ? '4px' : '20px'"
                         [style.border-bottom-left-radius]="msg.from === 'me' ? '20px' : '4px'">
                      {{ msg.content }}
                    </div>
                    <span style="font-size: 0.75rem; color: var(--gd-muted); margin: 0 0.5rem;" [style.align-self]="msg.from === 'me' ? 'flex-end' : 'flex-start'">
                      {{ msg.time }}
                    </span>
                  </div>
                }
              </div>

              <!-- Chat Input -->
              <div style="padding: 1.5rem; border-top: 1px solid var(--gd-border); background: white;">
                <div class="gd-search" style="border-radius: 100px; padding-right: 4px; border: 1px solid var(--gd-border);">
                  <iconify-icon icon="lucide:message-circle"></iconify-icon>
                  <input type="text" placeholder="Type your message..." [value]="messageInput()" (input)="messageInput.set($any($event.target).value)" (keydown)="onMessageKeydown($event)" style="border: none; outline: none; flex: 1; padding: 0.5rem; background: transparent;" />
                  <button class="gd-btn gd-btn--primary" style="border-radius: 100px; width: 40px; height: 40px; padding: 0; display: flex; align-items: center; justify-content: center;" (click)="sendMessage()" [disabled]="!messageInput().trim()">
                    <iconify-icon icon="lucide:send" style="margin: 0;"></iconify-icon>
                  </button>
                </div>
              </div>
            } @else {
              <div class="gd-empty-state" style="background: transparent; height: 100%; border-radius: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gd-blush); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                  <iconify-icon icon="lucide:message-circle" style="font-size: 2.5rem; color: var(--gd-terra); margin: 0;"></iconify-icon>
                </div>
                <h3 style="font-size: 1.25rem; color: var(--gd-ink); font-weight: 600; margin-bottom: 0.5rem;">Your Messages</h3>
                <p style="color: var(--gd-muted); text-align: center; max-width: 240px;">Select a conversation from the list to start messaging.</p>
              </div>
            }
          </div>
        </div>
      </div>
`;
  const fullBlockToRemove = content.substring(msgStart, msgEnd + 5);
  content = content.replace(fullBlockToRemove, newMessages);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Layout updated successfully');
