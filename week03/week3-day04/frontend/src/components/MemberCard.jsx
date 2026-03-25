import { Card, CardContent, CardActions, Typography, Button, Box, Avatar } from '@mui/material';

const MemberCard = ({ member, onEdit, onDelete }) => {
  return (
    <Card className="gsap-member-card" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}>
        {member.name.charAt(0)}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{member.name}</Typography>
        <Typography variant="body2" color="text.secondary">{member.role}</Typography>
        <Typography variant="caption" color="text.secondary">{member.email}</Typography>
      </Box>
      <CardActions>
        <Button size="small" onClick={() => onEdit(member)}>Edit</Button>
        <Button size="small" color="error" onClick={() => onDelete(member.id)}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default MemberCard;
