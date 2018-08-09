module.exports = socket => {
    socket.emit('welcome', { msg: 'thanks for connecting' });

    socket.on('changeSlideForClients', ({ slideId }) => {
      socket.broadcast.emit('goToSlide', { slideId });
    });
}
