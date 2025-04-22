import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { MessageSquare, ThumbsUp, Reply, Flag, Send } from 'lucide-react';
import { formatDate } from '../../utils';

/**
 * Discussion forum component for car enthusiasts
 */
const DiscussionForum = ({ user }) => {
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'What factors most affect car resale value?',
      author: 'CarExpert',
      date: new Date('2025-01-15'),
      content: 'I\'m curious about what factors have the biggest impact on a car\'s resale value. Is it mileage, brand, condition, or something else?',
      likes: 24,
      replies: [
        {
          id: 101,
          author: 'AutoEnthusiast',
          date: new Date('2025-01-16'),
          content: 'In my experience, brand reputation and reliability history are huge factors. Toyota and Honda tend to hold value better than many other brands.',
          likes: 12,
        },
        {
          id: 102,
          author: 'MechanicPro',
          date: new Date('2025-01-17'),
          content: 'Maintenance history is critical. A well-documented service history can significantly increase resale value, especially for luxury vehicles.',
          likes: 8,
        },
      ],
    },
    {
      id: 2,
      title: 'Electric vs. Hybrid: Which is better for commuting?',
      author: 'GreenDriver',
      date: new Date('2025-02-10'),
      content: 'I\'m considering switching to an electric or hybrid vehicle for my daily commute (about 30 miles each way). What are the pros and cons of each option?',
      likes: 18,
      replies: [
        {
          id: 201,
          author: 'EVFanatic',
          date: new Date('2025-02-11'),
          content: 'If you have charging at home and possibly at work, go electric. Lower operating costs and zero emissions. Just make sure the range works for your commute with some buffer.',
          likes: 7,
        },
      ],
    },
  ]);

  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
  });

  const [replyContent, setReplyContent] = useState({});
  const [activeReplies, setActiveReplies] = useState({});

  const handleNewDiscussionChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReplyChange = (discussionId, value) => {
    setReplyContent((prev) => ({
      ...prev,
      [discussionId]: value,
    }));
  };

  const toggleReplies = (discussionId) => {
    setActiveReplies((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  const handleLike = (discussionId) => {
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion.id === discussionId
          ? { ...discussion, likes: discussion.likes + 1 }
          : discussion
      )
    );
  };

  const handleReplyLike = (discussionId, replyId) => {
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion.id === discussionId
          ? {
              ...discussion,
              replies: discussion.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              ),
            }
          : discussion
      )
    );
  };

  const handleSubmitReply = (discussionId) => {
    if (!replyContent[discussionId]?.trim() || !user) return;

    const newReply = {
      id: Date.now(),
      author: user.username,
      date: new Date(),
      content: replyContent[discussionId],
      likes: 0,
    };

    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion.id === discussionId
          ? {
              ...discussion,
              replies: [...discussion.replies, newReply],
            }
          : discussion
      )
    );

    // Clear the reply input
    setReplyContent((prev) => ({
      ...prev,
      [discussionId]: '',
    }));
  };

  const handleSubmitDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim() || !user) return;

    const newPost = {
      id: Date.now(),
      title: newDiscussion.title,
      author: user.username,
      date: new Date(),
      content: newDiscussion.content,
      likes: 0,
      replies: [],
    };

    setDiscussions((prev) => [newPost, ...prev]);
    setNewDiscussion({ title: '', content: '' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Discussions</h2>
        <p className="text-gray-600">
          Join the conversation with fellow car enthusiasts
        </p>
      </div>

      {/* New Discussion Form */}
      {user ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Start a New Discussion</CardTitle>
            <CardDescription>
              Share your thoughts, questions, or insights with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Title"
                id="title"
                name="title"
                placeholder="Enter a descriptive title"
                value={newDiscussion.title}
                onChange={handleNewDiscussionChange}
              />
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Share your thoughts..."
                  value={newDiscussion.content}
                  onChange={handleNewDiscussionChange}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitDiscussion}
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  Post Discussion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 bg-gray-50">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Join the Conversation</h3>
            <p className="text-gray-600 mb-4">
              Log in or sign up to participate in discussions
            </p>
            <Button variant="primary">Log In / Sign Up</Button>
          </CardContent>
        </Card>
      )}

      {/* Discussion List */}
      <div className="space-y-6">
        {discussions.map((discussion) => (
          <Card key={discussion.id} className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {discussion.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="font-medium text-gray-700">{discussion.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(discussion.date)}</span>
              </div>
              <p className="text-gray-700 mb-4">{discussion.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(discussion.id)}
                    className="flex items-center text-gray-500 hover:text-primary"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{discussion.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleReplies(discussion.id)}
                    className="flex items-center text-gray-500 hover:text-primary"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    <span>{discussion.replies.length} Replies</span>
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-red-500">
                    <Flag className="h-4 w-4 mr-1" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* Replies Section */}
              {activeReplies[discussion.id] && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Replies</h4>
                  <div className="space-y-4">
                    {discussion.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="font-medium text-gray-700">{reply.author}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(reply.date)}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{reply.content}</p>
                        <button
                          onClick={() => handleReplyLike(discussion.id, reply.id)}
                          className="flex items-center text-gray-500 hover:text-primary"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span className="text-sm">{reply.likes}</span>
                        </button>
                      </div>
                    ))}

                    {/* Reply Form */}
                    {user ? (
                      <div className="flex items-center space-x-2 mt-4">
                        <Input
                          placeholder="Write a reply..."
                          value={replyContent[discussion.id] || ''}
                          onChange={(e) => handleReplyChange(discussion.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSubmitReply(discussion.id)}
                          icon={<Send className="h-4 w-4" />}
                        >
                          Reply
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-4">
                        Please log in to reply to discussions.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum;
