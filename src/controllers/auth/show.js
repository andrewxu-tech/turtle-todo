UsersShowCtrl.$inject = ['$http', '$state'];

function UsersShowCtrl($http, $state) {
  this.user = {};
  $http
    .get(`/api/users/${$state.params.id}`)
    .then(res => this.user = res.data)
    .then(() => $state.go('usersShow', { id: this.user._id }));

  function openModal(taskId){
    const modal = document.getElementById(taskId);
    modal.classList.toggle('is-active');
  }

  this.openModal = openModal;

}

export default UsersShowCtrl;
